package org.example.cafeforus.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.cafeforus.dto.LoginDto;
import org.example.cafeforus.dto.SignupDto;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody SignupDto dto) {
        System.out.println("🔍 Received SignupDto:");
        System.out.println("username: " + dto.getUsername());
        System.out.println("password: " + dto.getPassword());
        System.out.println("email: " + dto.getEmail());

        userService.register(dto);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDto dto, HttpServletRequest request) {
        System.out.println("🔍 로그인 시도: username = " + dto.getUsername());


        try {
            Users users = userService.authenticate(dto.getUsername(), dto.getPassword());
            System.out.println("🔐 인증 성공: " + users.getUsername());
            //권환 설정
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + users.getRole().name()); // "ROLE_ADMIN"과 같은 형식

            // 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(users, null, List.of(authority));

            // SecurityContext에 인증 정보 저장
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            // 세션에 사용자 정보와 SecurityContext를 저장
            HttpSession session = request.getSession(true);
            session.setAttribute("user", users);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            // 응답 반환
            Map<String, String> response = new HashMap<>();
            response.put("username", users.getUsername());
            response.put("role", users.getRole().name());
            response.put("message", "로그인 성공");

            return ResponseEntity.ok(response);


        } catch (UsernameNotFoundException e) {
            System.out.println("❌ 유저를 찾을 수 없습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "유저를 찾을 수 없습니다."));

        } catch (BadCredentialsException e) {
            System.out.println("❌ 비밀번호 불일치: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "비밀번호가 올바르지 않습니다."));

        } catch (Exception e) {
            System.out.println("❌ 서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("로그아웃 성공");
    }
    // 로그인 상태 확인용 API
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증된 사용자 정보가 Users 객체가 아닐 경우
        if (!(authentication.getPrincipal() instanceof Users users)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 올바르지 않습니다.");
        }

        // 이미 `users` 객체가 사용 가능한 상태이므로, 다시 선언할 필요 없음
        return ResponseEntity.ok(Map.of(
                "username", users.getUsername(),
                "role", users.getRole().name()
        ));
    }


}