package com.crs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final String secretKey = "dj83HF8sKd92mfL!@#1xZpLQvT7e$Wn9"; // Raw string secret

    public String extractUsername(String token) {
        return getAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Claims claims = getAllClaims(token);
        return claims.get("role", String.class); 
    }    

    public Collection<SimpleGrantedAuthority> extractRoles(String token) {
        Claims claims = getAllClaims(token);

        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof List) {
            List<?> roles = (List<?>) rolesClaim;
            return roles.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        }

        String singleRole = claims.get("role", String.class);
        if (singleRole != null) {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + singleRole));
        }

        return Collections.emptyList();
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}
