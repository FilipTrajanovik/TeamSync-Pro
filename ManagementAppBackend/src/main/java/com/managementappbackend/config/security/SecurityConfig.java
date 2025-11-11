package com.managementappbackend.config.security;

import com.managementappbackend.web.filters.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(com.managementappbackend.web.filters.JwtFilter jwtFilter,
                          UserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(corsCustomizer -> corsCustomizer.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/billing/plans").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/h2-console/**",
                                "/",
                                "/h2/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/billing/webhook").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/users/create").hasAnyRole("MANAGER", "ADMIN", "OWNER")
                        .requestMatchers(HttpMethod.GET, "/api/users/managers").hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(HttpMethod.GET, "/api/users/organization/**").hasAnyRole("MANAGER", "ADMIN", "OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/update").hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/change-password").hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "OWNER")

                        .requestMatchers("/api/analytics/admin/**").hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers("/api/analytics/manager/**").hasAnyRole("MANAGER", "ADMIN", "OWNER")
                        .requestMatchers("/api/analytics/user/**").hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")
                        .requestMatchers("/api/tasks/organization-tasks").hasAnyRole("MANAGER", "ADMIN")


                        .requestMatchers(
                                "/api/tasks/toggle-finish",
                                "/api/tasks/*/update"
                        ).hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")


                        .requestMatchers("/api/notifications/**").hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")
                        .requestMatchers("/api/comments/**").hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")
                        .requestMatchers("/api/billing/checkout").hasAnyRole("OWNER", "ADMIN", "MANAGER")
                        .requestMatchers("/api/organizations/**").hasAnyRole("ADMIN", "OWNER","MANAGER")
                        .requestMatchers(
                                "/api/clients/**",
                                "/api/tasks/**",
                                "/api/records/**"
                        ).hasAnyRole("USER", "MANAGER", "ADMIN", "OWNER")


                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
