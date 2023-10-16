package com.pixshare.pixshareapi.jwt;

import com.pixshare.pixshareapi.TestEnvPropertiesInitializer;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@ContextConfiguration(initializers = TestEnvPropertiesInitializer.class)
class JWTUtilTest {

    @Autowired
    private JWTUtil jwtUtil;


    @Test
    @DisplayName("Should issue a token with the provided subject and empty claims")
    void issueTokenWithSubjectAndEmptyClaims() {
        String subject = "user123";
        Map<String, Object> claims = Map.of();

        String token = jwtUtil.issueToken(subject, claims);

        assertNotNull(token);
        assertEquals(subject, jwtUtil.getSubject(token));
        assertTrue(jwtUtil.isTokenValid(token, subject));
    }

    @Test
    @DisplayName("Should issue a token with the provided subject and claims")
    void issueTokenWithSubjectAndClaims() {
        String subject = "user123";
        String scopes = "ROLE_ADMIN";
        Map<String, Object> claims = Map.of("scopes", scopes);

        String token = jwtUtil.issueToken(subject, claims);

        assertNotNull(token);
        assertEquals(subject, jwtUtil.getSubject(token));
        assertEquals(scopes, jwtUtil.getClaims(token).get("scopes"));
        assertTrue(jwtUtil.isTokenValid(token, subject));
    }

    @Test
    @DisplayName("Should issue a token with the provided subject and scope claims as array")
    void issueTokenWithSubjectAndScopeClaimsAsArray() {
        String subject = "user123";
        String[] scopes = {"ROLE_ACCESS", "ROLE_WRITE", "ROLE_DELETE"};
        Map<String, Object> claims = Map.of("scopes", scopes);

        String token = jwtUtil.issueToken(subject, claims);

        Claims parsedClaims = jwtUtil.getClaims(token);

        assertNotNull(token);
        assertEquals(subject, jwtUtil.getSubject(token));
        assertNotNull(parsedClaims);
        assertEquals(List.of(scopes), parsedClaims.get("scopes"));
    }

    @Test
    @DisplayName("Should issue a token with the provided subject and scope claims as list")
    void issueTokenWithSubjectAndScopeClaimsAsList() {
        String subject = "user123";
        List<String> scopes = List.of("ROLE_ACCESS", "ROLE_WRITE", "ROLE_DELETE");
        Map<String, Object> claims = Map.of("scopes", scopes);

        String token = jwtUtil.issueToken(subject, claims);

        Claims parsedClaims = jwtUtil.getClaims(token);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertEquals(subject, parsedClaims.getSubject());
        assertEquals(scopes, parsedClaims.get("scopes"));
    }

    @Test
    @DisplayName("Should throw an exception when the token is invalid")
    void getSubjectWhenTokenIsInvalidThenThrowException() {
        String invalidToken = "invalidToken";

        assertThrows(MalformedJwtException.class, () -> jwtUtil.getSubject(invalidToken));
    }

    @Test
    @DisplayName("Should return the subject from the token")
    void getSubjectFromToken() {
        String subject = "user123456";
        String token = jwtUtil.issueToken(subject);

        String actualSubject = jwtUtil.getSubject(token);

        assertEquals(subject, actualSubject);
    }

    @Test
    @DisplayName("Should return true when the token is valid and the username matches the subject in the token")
    void isTokenValidWhenUsernameMatchesSubjectAndTokenIsValid() {
        String subject = "john.doe";
        String token = jwtUtil.issueToken(subject);

        assertTrue(jwtUtil.isTokenValid(token, subject));
    }

    @Test
    @DisplayName("Should return false when the token is valid but the username does not match the subject in the token")
    void isTokenValidWhenUsernameDoesNotMatchSubjectButTokenIsValid() {
        String token = jwtUtil.issueToken("john.doe@example.com");
        String username = "jane.doe@example.com";

        boolean result = jwtUtil.isTokenValid(token, username);

        assertFalse(result);
    }

}