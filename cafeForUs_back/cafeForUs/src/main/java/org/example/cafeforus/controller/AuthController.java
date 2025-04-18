package org.example.cafeforus.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.cafeforus.dto.LoginDto;
import org.example.cafeforus.dto.SignupDto;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

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

    // 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDto dto, HttpServletRequest request) {
        System.out.println("🔍 Received LoginDto:");
        System.out.println("username: " + dto.getUsername());
        System.out.println("password: " + dto.getPassword());

        try {
            // 아이디로 유저를 찾음
            User user = userService.authenticate(dto.getUsername(), dto.getPassword());
            System.out.println("🔐 로그인된 유저 정보: " + user);
            // 세션 생성 및 사용자 정보 저장
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);

            return ResponseEntity.ok(Map.of("username", user.getUsername()));
        } catch (IllegalArgumentException e) {
            System.out.println("🔍 로그인 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "로그인 실패: " + e.getMessage()));
        }
    }
    // 로그아웃 처리
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
    public ResponseEntity<?> getMe(HttpSession session) {
        Object userObj = session.getAttribute("user");

        if (userObj == null) {
            System.out.println("⛔ 세션에 사용자 정보 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인되지 않음");
        }

        User user = (User) userObj;
        System.out.println("✅ 세션에서 확인된 로그인 유저: " + user);

        return ResponseEntity.ok(Map.of("username", user.getUsername()));
    }

}