package com.pixshare.pixshareapi.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pixshare.pixshareapi.exception.EmailDeliveryException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sendinblue.ApiClient;
import sendinblue.ApiException;
import sendinblue.Configuration;
import sendinblue.auth.ApiKeyAuth;
import sibApi.TransactionalEmailsApi;
import sibModel.CreateSmtpEmail;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailTo;

import java.util.Collections;
import java.util.Map;
import java.util.Properties;

@Service
public class BrevoMailSender {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    public TransactionalEmailsApi getTransacEmailsApiInstance() {
        ApiClient defaultApiClient = Configuration.getDefaultApiClient();

        // Configure API key authorization: api-key
        ApiKeyAuth apiAuthKey = (ApiKeyAuth) defaultApiClient.getAuthentication("api-key");
        apiAuthKey.setApiKey(brevoApiKey);

        // Create TransactionalEmailsApi instance
        TransactionalEmailsApi apiInstance = new TransactionalEmailsApi(defaultApiClient);

        return apiInstance;
    }

    public void sendTransactionalEmail(TransactionalEmailsApi apiInstance, String recipientEmail, String recipientName, String subject, Properties params) throws ApiException {
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(recipientEmail);
        to.setName(recipientName);

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.setTo(Collections.singletonList(to));
        sendSmtpEmail.setSubject(subject);
        sendSmtpEmail.setTemplateId(1L);

        // Optional: Add parameters for dynamic content in the template
        sendSmtpEmail.setParams(params);

        CreateSmtpEmail response = apiInstance.sendTransacEmail(sendSmtpEmail);
        System.out.println(response.toString());
    }

    public void sendTransactionalEmail(TransactionalEmailsApi apiInstance, String recipientEmail, String recipientName, String subject, Properties params, Long templateId) throws ApiException {
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(recipientEmail);
        to.setName(recipientName);

        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.setTo(Collections.singletonList(to));
        sendSmtpEmail.setSubject(subject);
        sendSmtpEmail.setTemplateId(templateId);

        // Optional: Add parameters for dynamic content in the template
        sendSmtpEmail.setParams(params);

        CreateSmtpEmail response = apiInstance.sendTransacEmail(sendSmtpEmail);
        System.out.println(response.toString());
    }

    public void handleBrevoEmailApiException(ApiException e, String failureMessage) {
        String responseBody = e.getResponseBody();

        if (responseBody == null || responseBody.isBlank()) {
            throw new EmailDeliveryException(failureMessage);
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> responseMap = objectMapper.readValue(responseBody, Map.class); // Parse JSON to Map
            String code = responseMap.get("code");
            System.out.println(responseBody);

            // Check for specific codes
            if (code.equals("not_enough_credits")) {
                throw new EmailDeliveryException("Daily email limit has been reached, so we are unable to send the email at this time. Please try again tomorrow.");
            } else {
                throw new EmailDeliveryException(failureMessage);
            }
        } catch (JsonProcessingException ex) {
            System.out.println(ex.getMessage());
            throw new EmailDeliveryException(failureMessage);
        }
    }

}
