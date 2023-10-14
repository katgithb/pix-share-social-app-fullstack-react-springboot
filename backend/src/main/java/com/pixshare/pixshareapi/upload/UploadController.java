package com.pixshare.pixshareapi.upload;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
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
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        Map<String, String> uploadSignatureMap = uploadService.generateCloudinaryUploadSignature(identity.getId(), signatureRequest);
        UploadSignatureResponse response = new UploadSignatureResponse(uploadSignatureMap.get("uploadSignature"), uploadSignatureMap.get("timestamp"), uploadSignatureMap.get("public_id"));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
