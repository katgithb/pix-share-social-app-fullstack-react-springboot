package com.pixshare.pixshareapi.util;

import com.pixshare.pixshareapi.exception.TokenValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class HMACTokenUtil {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final DateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    @Value("${password-reset.token.secret-key}")
    private String SECRET_KEY;
    @Value("${password-reset.token.expiry-seconds}")
    private int TOKEN_EXPIRATION_IN_SECONDS;

    public String generateHMACToken(String identifier, Date timestamp) {
        Date timestampDate = timestamp == null ? new Date() : timestamp;
        long timestampMillis = timestampDate.getTime();
        String timestampStr = DATE_FORMAT.format(timestampDate);
        String data = identifier + timestampStr;

        long expirationTime = timestampMillis + (TOKEN_EXPIRATION_IN_SECONDS * 1000L);
        String metadata = expirationTime + "|" + identifier + "|" + UUID.randomUUID();
        String base64Metadata = Base64.getUrlEncoder().encodeToString(metadata.getBytes());

        String hmacHash = generateHMACHash(data, SECRET_KEY);

        return hmacHash + "." + base64Metadata;
    }

    public boolean validateToken(String identifier, String token) throws TokenValidationException {
        String[] parts = token.split("\\.");
        // Check if token has exactly two parts
        if (parts.length != 2) {
            throw new TokenValidationException("Invalid token format");
        }

        String hmacHash = parts[0];
        String metadata = extractMetadataFromToken(token);
        String expirationTimeStr = extractExpirationTimeFromTokenMetadata(metadata);
        long expirationTime = Long.parseLong(expirationTimeStr);
        long currentTime = new Date().getTime();

        // Check if token has expired
        if (expirationTime < currentTime) {
            throw new TokenValidationException("Token expired");
        }

        // Recreate original timestamp from expiration time
        long timestampMillis = expirationTime - (TOKEN_EXPIRATION_IN_SECONDS * 1000L);
        String timestampStr = DATE_FORMAT.format(new Date(timestampMillis));

        // Check if HMAC hash is valid
        String data = identifier + timestampStr;
        String generatedHash = generateHMACHash(data, SECRET_KEY);
        return hmacHash.equals(generatedHash);
    }

    public String extractMetadataFromToken(String token) {
        String[] parts = token.split("\\.");
        // Check if token has exactly two parts
        if (parts.length != 2) {
            throw new TokenValidationException("Invalid token format");
        }

        String base64Metadata = parts[1];
        byte[] metadataBytes = Base64.getUrlDecoder().decode(base64Metadata);

        return new String(metadataBytes);
    }

    public long extractTimestampMillisFromToken(String token) {
        String metadata = extractMetadataFromToken(token);
        String expirationTimeStr = extractExpirationTimeFromTokenMetadata(metadata);
        long expirationTime = Long.parseLong(expirationTimeStr);

        // Get timestamp in milliseconds using expiration time
        long timestampMillis = expirationTime - (TOKEN_EXPIRATION_IN_SECONDS * 1000L);

        return timestampMillis;
    }

    public String extractIdentifierFromTokenMetadata(String metadata) {
        String[] metadataParts = metadata.split("\\|");
        String identifier = metadataParts[1];

        return identifier;
    }


    private String generateHMACHash(String data, String secretKey) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), HMAC_ALGORITHM);

            // Create HMAC Signer with SHA-256 algorithm and secret key
            Mac hmac = Mac.getInstance(HMAC_ALGORITHM);
            hmac.init(secretKeySpec);

            // Generate HMAC hash
            byte[] hashBytes = hmac.doFinal(data.getBytes());

            // Encode hash bytes into Base64 string and return it
            return Base64.getUrlEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error generating hash");
        }
    }

    public String extractExpirationTimeFromTokenMetadata(String metadata) {
        String[] metadataParts = metadata.split("\\|");
        String expirationTime = metadataParts[0];

        return expirationTime;
    }

}
