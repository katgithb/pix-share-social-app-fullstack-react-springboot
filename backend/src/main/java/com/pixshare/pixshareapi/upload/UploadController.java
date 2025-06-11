package com.pixshare.pixshareapi.upload;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@Tag(name = "Upload", description = "Endpoints for image uploads")
public class UploadController {

    private final UploadService uploadService;

    private final AuthenticationService authenticationService;

    public UploadController(UploadService uploadService, AuthenticationService authenticationService) {
        this.uploadService = uploadService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signature")
    public ResponseEntity<UploadSignatureResponse> generateSignature(
            @RequestBody UploadSignatureRequest signatureRequest,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        Map<String, String> uploadSignatureMap = uploadService.generateCloudinaryUploadSignature(identity.getId(), signatureRequest);
        UploadSignatureResponse response = new UploadSignatureResponse(uploadSignatureMap.get("uploadSignature"), uploadSignatureMap.get("timestamp"), uploadSignatureMap.get("public_id"));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
