package com.khushal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http) {
        http.authorizeExchange(
                exchanges -> exchanges
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/api/notifications/ws/**").permitAll()
                        .pathMatchers("/api/categories/salon-owner/**").hasRole("SALON_OWNER")
                        .pathMatchers("/api/salons/**",
                                "/api/categories/**",
                                "/api/notifications/**",
                                "/api/bookings/**",
                                "/api/service-offering/**",
                                "/api/payments/**",
                                "/api/users/**",
                                "/api/reviews/**").hasAnyRole("CUSTOMER", "SALON_OWNER", "ADMIN")
                        .anyExchange().authenticated()
        ).oauth2ResourceServer(oAuth2ResourceServerSpec ->  oAuth2ResourceServerSpec
                .jwt(jwtSpec -> jwtSpec.jwtAuthenticationConverter(grantAuthoritiesExtractor())));
        http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return  http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5170",
                "http://localhost:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return  source;
    }

    private Converter<Jwt,? extends Mono<? extends AbstractAuthenticationToken>> grantAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
                new KeycloakRoleConverter()
        );

        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }

//    added to remove duplicate headers (getting in websocket in notification-service)
    @Bean
    public WebFilter corsDedupeFilter() {
        return (exchange, chain) -> {
            // We hook into the 'beforeCommit' phase - this is the last chance
            // to modify headers before they are sent to the browser.
            exchange.getResponse().beforeCommit(() -> {
                HttpHeaders headers = exchange.getResponse().getHeaders();

                // 1. Deduplicate Access-Control-Allow-Origin
                if (headers.containsHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN)) {
                    String firstOrigin = headers.getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
                    headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, firstOrigin);
                }

                // 2. Deduplicate Access-Control-Allow-Credentials
                if (headers.containsHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS)) {
                    String firstCreds = headers.getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS);
                    headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, firstCreds);
                }

                return Mono.empty();
            });
            return chain.filter(exchange);
        };
    }

}
