package com.pixshare.pixshareapi.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JWTUtil {

    private static final String SECRET_KEY = "RmRPS2c0Tm1xWm8kZEE4aCU5eFI4YlFaKmF1NEVUSmY3bGJQbVNEYUZbcjlHd0gpQ2V9TTRbTnokaXNYJmc2KyQ/ekZueyUmJEgwcytVPSZtVipQMzk9WmY9MyhJND9PcW0xbkpRVkRWNEo1KlJKPVB9aFlIKzl6c0UwN1BNbytSOHJ7TCN9ZGowfSU9VmxBdT0qazI9WTUkdmRPUE9hZFNMcW9zM1RzP3Y/OH1dcCYhK0koX05kX1tqSWJrQEg=";

    private static final String TOKEN_ISSUER = "pixshare";

    private static final int TOKEN_EXPIRATION_IN_SECONDS = 86400;

    public String issueToken(String subject, Map<String, Object> claims) {
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuer(TOKEN_ISSUER)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(TOKEN_EXPIRATION_IN_SECONDS, ChronoUnit.SECONDS)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        return token;
    }

    public String issueToken(String subject) {
        return issueToken(subject, Map.of());
    }

    public String issueToken(String subject, String... scopes) {
        return issueToken(subject, Map.of("scopes", scopes));
    }

    public String issueToken(String subject, List<String> scopes) {
        return issueToken(subject, Map.of("scopes", scopes));
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String jwt, String username) {
        String subject = getSubject(jwt);
        return subject.equals(username) && !isTokenExpired(jwt);
    }

    private boolean isTokenExpired(String jwt) {
        Date today = Date.from(Instant.now());
        return getClaims(jwt).getExpiration().before(today);
    }

}
