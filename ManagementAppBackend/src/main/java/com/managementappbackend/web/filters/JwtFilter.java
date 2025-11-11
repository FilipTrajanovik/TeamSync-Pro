package com.managementappbackend.web.filters;

import com.managementappbackend.constants.JwtConstants;
import com.managementappbackend.helpers.JwtHelper;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.service.domain.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtHelper jwtHelper;
    private final UserService userService;
    private final HandlerExceptionResolver handlerExceptionResolver;

    public JwtFilter(JwtHelper jwtHelper, @Lazy UserService userService, HandlerExceptionResolver handlerExceptionResolver) {
        this.jwtHelper = jwtHelper;
        this.userService = userService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("=== JWT FILTER DEBUG ===");
        System.out.println("Full URL: " + request.getRequestURL());
        System.out.println("URI: " + requestPath);
        System.out.println("Method: " + method);
        System.out.println("Query String: " + request.getQueryString());

        // Check if it's a public endpoint
        boolean isPublicEndpoint = requestPath.equals("/api/users/register") ||
                requestPath.equals("/api/users/login") ||
                requestPath.startsWith("/swagger-ui") ||
                requestPath.equals("/api/billing/webhook") ||
                requestPath.startsWith("/v3/api-docs") ||
                requestPath.startsWith("/h2-console") ||
                requestPath.equals("/api/billing/plans");


        System.out.println("Is Public Endpoint? " + isPublicEndpoint);

        if (isPublicEndpoint) {
            filterChain.doFilter(request, response);
            return;
        }


        String headerValue = request.getHeader(JwtConstants.HEADER);

        if (headerValue == null || !headerValue.startsWith(JwtConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = headerValue.substring(JwtConstants.TOKEN_PREFIX.length());

        try {
            String username = jwtHelper.extractUsername(token);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


            if (username == null || authentication != null) {
                filterChain.doFilter(request, response);
                return;
            }

            User user = userService.findByUsername(username);
            if (jwtHelper.isValid(token, user)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ JWT Invalid");
            }
        } catch (JwtException jwtException) {
            handlerExceptionResolver.resolveException(
                    request,
                    response,
                    null,
                    jwtException
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

}
