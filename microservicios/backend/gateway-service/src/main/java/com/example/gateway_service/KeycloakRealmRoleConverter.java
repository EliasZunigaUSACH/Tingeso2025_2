package com.example.gateway_service;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import reactor.core.publisher.Flux;

import java.util.*;

public class KeycloakRealmRoleConverter implements Converter<Jwt, Flux<GrantedAuthority>> {
    @Override
    public Flux<GrantedAuthority> convert(Jwt jwt) {
        if (jwt.getClaims() == null) {
            return Flux.empty();
        }

        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");

        if (realmAccess == null || realmAccess.isEmpty()) {
            return Flux.empty();
        }

        Object rolesObj = realmAccess.get("roles");

        if (rolesObj instanceof List<?>) {
            List<String> roles = (List<String>) rolesObj;

            // AQUÍ ESTÁ LA MAGIA: Flux.fromIterable
            return Flux.fromIterable(roles)
                    .map(roleName -> "ROLE_" + roleName) // Transformar String a String con prefijo
                    .map(SimpleGrantedAuthority::new);   // Transformar String a GrantedAuthority
        }

        return Flux.empty();
    }
}
