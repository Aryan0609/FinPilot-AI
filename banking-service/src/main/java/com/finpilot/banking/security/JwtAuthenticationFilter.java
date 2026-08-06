package com.finpilot.banking.security;

import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;


@Component
public class JwtAuthenticationFilter 
        extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final UserRepository userRepository;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }



    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)

            throws ServletException, IOException {


        String header =
                request.getHeader("Authorization");


        if(header == null || !header.startsWith("Bearer ")) {

            filterChain.doFilter(request,response);
            return;
        }


        String token =
                header.substring(7);



        if(jwtService.isTokenValid(token)) {


            String email =
                    jwtService.extractEmail(token);



            String roles =
                    jwtService.extractRoles(token);


            if(roles == null){
                roles = "USER";
            }



            var authorities =
        Arrays.stream(roles.split(","))
        .map(String::trim)
        .map(SimpleGrantedAuthority::new)
        .toList();


            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );


            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        }


        filterChain.doFilter(request,response);
    }
}