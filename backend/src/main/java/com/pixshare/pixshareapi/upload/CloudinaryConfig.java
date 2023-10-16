package com.pixshare.pixshareapi.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.api-env-url}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        // Validate cloudinary URL format
        if (!cloudinaryUrl.matches("cloudinary://\\w+:\\w+@\\w+")) {
            throw new IllegalArgumentException("Invalid cloudinary URL format");
        }

        Cloudinary cloudinaryClient = new Cloudinary(cloudinaryUrl);
        cloudinaryClient.config.secure = true;
        cloudinaryClient.config.signatureAlgorithm = SignatureAlgorithm.SHA256;

        return cloudinaryClient;
    }

}
