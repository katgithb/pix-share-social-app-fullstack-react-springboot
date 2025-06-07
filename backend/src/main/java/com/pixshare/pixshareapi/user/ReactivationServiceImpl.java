package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.dto.ReactivationRequestDTO;
import com.pixshare.pixshareapi.dto.ReactivationRequestDTOMapper;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.util.BrevoMailSender;
import com.pixshare.pixshareapi.validation.UrlValidator;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sendinblue.ApiException;
import sibApi.TransactionalEmailsApi;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class ReactivationServiceImpl implements ReactivationService {

    private static final int REVIEW_WINDOW_DURATION_IN_SECONDS = 3600 * 24 * 15; // 15 days

    private final ReactivationRequestRepository reactivationRequestRepository;

    private final UserRepository userRepository;

    private final ValidationUtil validationUtil;

    private final BrevoMailSender brevoMailSender;

    private final UrlValidator urlValidator;

    private final ReactivationRequestDTOMapper reactivationRequestDTOMapper;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Override
    @Transactional
    public MessageResponse createReactivationRequest(String email) throws RequestValidationException {
        long reviewWindowDurationDays = getDurationInDaysFromSeconds(REVIEW_WINDOW_DURATION_IN_SECONDS);
        String formattedDurationDays = String.format(
                "%d %s", reviewWindowDurationDays, reviewWindowDurationDays == 1 ? "day" : "days");
        MessageResponse messageResponse = new MessageResponse(
                "Reactivation request submitted. Admin will review your request within %s.".formatted(formattedDurationDays));

        // Validate email
        validationUtil.performValidationOnField(ReactivationRequest.class, "email", email);

        // Check if there's already a reactivation request for this email
        if (reactivationRequestRepository.existsByEmail(email)) {
            return messageResponse;
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent() && userOptional.get().getStatus() == UserStatus.BLOCKED) {
            throw new RequestValidationException("Account is currently blocked, not eligible for reactivation.");
        }

        return userOptional
                .filter(user -> !RoleName.ADMIN.matches(user.getRole().getRoleName())
                        && user.getStatus() != UserStatus.ACTIVE)
                .map(user -> {
                    ReactivationRequest request = new ReactivationRequest(email, user);
                    reactivationRequestRepository.save(request);
                    return messageResponse;
                })
                .orElse(messageResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReactivationRequestDTO> getReactivationRequests(String status, PageRequestDTO pageRequest) {
        String adminRole = RoleName.ADMIN.name();

        Pageable pageable = pageRequest.toPageable();
        Page<ReactivationRequest> reactivationRequestPage;

        // Get reactivation requests based on status filter
        reactivationRequestPage = Optional.ofNullable(status)
                .filter(s -> !s.isBlank())
                .map(ReactivationRequestStatus::from)
                .map(requestStatus -> reactivationRequestRepository
                        .findAllByStatusAndUser_Role_RoleNameNot(requestStatus, adminRole, pageable))
                .orElseGet(() -> reactivationRequestRepository
                        .findAllByUser_Role_RoleNameNot(adminRole, pageable));

        return createPagedResponseFromReactivationRequestPage(reactivationRequestPage);
    }

    @Override
    @Transactional(readOnly = true)
    public ReactivationRequestDTO getReactivationRequestById(Long requestId) throws ResourceNotFoundException {

        return reactivationRequestRepository.findById(requestId)
                .map(reactivationRequestDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Reactivation request with id [%s] not found".formatted(requestId)));
    }

    @Override
    @Transactional
    public MessageResponse reviewReactivationRequest(Long requestId, String requestStatus)
            throws ResourceNotFoundException, RequestValidationException {
        // Validate and parse status
        ReactivationRequestStatus status = Optional.ofNullable(requestStatus)
                .filter(s -> !s.isBlank())
                .map(ReactivationRequestStatus::from)
                .orElseThrow(() -> new RequestValidationException("Reactivation request status is required"));

        // Check if status is PENDING
        if (status == ReactivationRequestStatus.PENDING) {
            throw new RequestValidationException("Status cannot be set to PENDING while reviewing. Use APPROVED or REJECTED instead.");
        }

        ReactivationRequest reactivationRequest = reactivationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Reactivation request with id [%s] not found".formatted(requestId)));

        // Check if request is already reviewed
        if (reactivationRequest.getStatus() == ReactivationRequestStatus.APPROVED
                || reactivationRequest.getStatus() == ReactivationRequestStatus.REJECTED) {
            throw new RequestValidationException("This reactivation request has already been reviewed");
        }

        // Update request status
        reactivationRequest.updateStatus(status);

        User user = reactivationRequest.getUser();

        // If approved, reactivate the user account
        Optional.of(reactivationRequest)
                .filter(req -> req.getStatus() == ReactivationRequestStatus.APPROVED)
                .map(ReactivationRequest::getUser)
                .ifPresent(u -> {
                    u.setLastLoginAt(OffsetDateTime.now());
                    u.updateStatus(UserStatus.ACTIVE);
                    userRepository.save(u);
                });

        // Save reactivation request
        reactivationRequestRepository.save(reactivationRequest);

        // Send email notification to user about the reactivation request status
        sendReactivationStatusEmail(appBaseUrl, user, status);

        String action = reactivationRequest.getStatus().toLowercaseString();
        return new MessageResponse("Reactivation request " + action + " successfully");
    }

    /**
     * Helper method to create a paged response from a page of reactivation requests.
     */
    private PagedResponse<ReactivationRequestDTO> createPagedResponseFromReactivationRequestPage(
            Page<ReactivationRequest> reactivationRequestPage) {
        // Get reactivation requests content from Page
        List<ReactivationRequestDTO> content = reactivationRequestPage.getContent().stream()
                .map(reactivationRequestDTOMapper)
                .toList();

        return new PagedResponse<>(
                content,
                reactivationRequestPage.getNumber(),
                reactivationRequestPage.getSize(),
                reactivationRequestPage.getTotalElements(),
                reactivationRequestPage.getTotalPages(),
                reactivationRequestPage.isLast());
    }

    /**
     * Helper method to calculate duration in days from seconds.
     */
    private long getDurationInDaysFromSeconds(int seconds) {
        Duration duration = Duration.ofSeconds(seconds);

        return duration.toDays();
    }

    /**
     * Sends an email notification to the user about their reactivation request status.
     */
    private void sendReactivationStatusEmail(String baseUrl, User user, ReactivationRequestStatus status) {
        baseUrl = baseUrl != null ? baseUrl : "";
        // Validate base url
        if (!urlValidator.isValidUrl(baseUrl)) {
            throw new RequestValidationException("Invalid reactivation request base url");
        }

        // Validate user and status
        if (user == null || status == null) {
            return;
        }

        String email = user.getEmail();
        String name = user.getName();
        String subject = "Account Reactivation Update";
        long templateId = 0L;
        // Construct account login link and reactivation request links
        String accountLoginLink = baseUrl + "/login";
        String reactivationRequestLink = baseUrl;

        Properties params = new Properties();
        params.setProperty("NAME", name);

        // Add appropriate parameters based on the status
        if (status == ReactivationRequestStatus.APPROVED) {
            templateId = 2L;
            params.setProperty("ACCOUNT_LOGIN_LINK", accountLoginLink);
        } else if (status == ReactivationRequestStatus.REJECTED) {
            templateId = 3L;
            params.setProperty("REACTIVATION_REQUEST_LINK", reactivationRequestLink);
        } else {
            return;
        }

        // Send email using Brevo
        try {
            TransactionalEmailsApi apiInstance = brevoMailSender.getTransacEmailsApiInstance();
            brevoMailSender.sendTransactionalEmail(apiInstance, email, name, subject, params, templateId);
        } catch (ApiException e) {
            String failureMessage = "There was an unexpected error sending the reactivation status email. " +
                    "Please try submitting it again.";
            brevoMailSender.handleBrevoEmailApiException(e, failureMessage);
        }
    }

}