package com.example.gateway_service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.*;

@Configuration
@EnableWebFluxSecurity // <--- IMPORTANTE: Usar la anotación reactiva
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // 1. CORS (Usando la configuración de abajo)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF (Deshabilitado para APIs)
                .csrf(csrf -> csrf.disable())

                // 3. AUTORIZACIÓN (authorizeExchange en vez de authorizeHttpRequests)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS).permitAll() // Permitir Preflight
                        .pathMatchers("/actuator/**").permitAll()     // Permitir Health checks
                        .pathMatchers("/public/**").permitAll()       // Tus rutas públicas
                        .pathMatchers("/api/**").authenticated()
                        .anyExchange().authenticated() // Todo lo demás requiere login
                )

                // 4. OAUTH2 (Configuración Reactiva)
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Tus orígenes permitidos exactos
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:8070",
                "http://localhost:8090",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Para que el front pueda leer headers
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        // UrlBasedCorsConfigurationSource REACTIVO
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 5. CONVERTIDOR DE ROLES (ADAPTADO A REACTIVO)
    // Extrae los roles de "realm_access" -> "roles" y los convierte a "ROLE_ADMIN", etc.
    @Bean
    public Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtAuthenticationConverter() {
        ReactiveJwtAuthenticationConverter jwtConverter = new ReactiveJwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return jwtConverter;
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        // Reemplaza con tu URL real de Keycloak
        return NimbusReactiveJwtDecoder
                .withIssuerLocation("http://localhost:9090/realms/toolrent-realm")
                .build();
    }
}