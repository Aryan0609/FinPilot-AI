package com.finpilot.banking.security;

import com.finpilot.banking.entity.User;
import com.finpilot.banking.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final String SECRET =
            "finpilotsecretkeyfinpilotsecretkey123456";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
            );

    private final long EXPIRATION = 1000 * 60 * 60 * 24;


    public String generateToken(User user) {

        String roles = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.joining(","));


        return Jwts.builder()
                .subject(user.getEmail())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(
                    new Date(System.currentTimeMillis() + EXPIRATION)
                )
                .signWith(key)
                .compact();
    }


    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }


    public String extractRoles(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("roles", String.class);
    }


    public boolean isTokenValid(String token) {

        try {
            extractEmail(token);
            return true;
        }
        catch(Exception e) {
            return false;
        }
    }
}