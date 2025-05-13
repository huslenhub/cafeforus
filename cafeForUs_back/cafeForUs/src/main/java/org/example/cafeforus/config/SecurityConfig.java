package org.example.cafeforus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration//설정 클래스임을 나타낸다
@EnableWebSecurity//spring security 활성화
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/chat/**").authenticated()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/register", "/api/login", "/api/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/me").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category/all").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category/name/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posts/category/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/posts/write").authenticated()                 // 로그인한 사용자만 글 작성 가능
                        .requestMatchers(HttpMethod.PUT, "/api/posts/update/**").authenticated()              // 글 수정
                        .requestMatchers(HttpMethod.DELETE, "/api/posts/delete**").authenticated()              // 글 삭제
                        .requestMatchers(HttpMethod.GET, "/api/posts/read/**").authenticated()            // 글 삭제
                        .requestMatchers(HttpMethod.GET,"/uploads/**").permitAll() // ✅ 이미지 접근 허용
                        .requestMatchers(HttpMethod.GET,"/api/posts/comments/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/comments/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/comments/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/comments/**").authenticated()
                        .requestMatchers("/").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin().disable()
                .httpBasic().disable();


        return http.build();
    }


    //password 를 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true); // 쿠키 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
