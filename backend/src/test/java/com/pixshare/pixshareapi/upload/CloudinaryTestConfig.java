package com.pixshare.pixshareapi.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.SignatureAlgorithm;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Map;

@TestConfiguration
public class CloudinaryTestConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> cloudinaryConfig = Map.of(
                "cloud_name", "test_cloud_name",
                "api_key", "test_api_key",
                "api_secret", "test_api_secret");

        Cloudinary cloudinary = new Cloudinary(cloudinaryConfig);
        cloudinary.config.secure = true;
        cloudinary.config.signatureAlgorithm = SignatureAlgorithm.SHA256;

        return cloudinary;
    }

}
