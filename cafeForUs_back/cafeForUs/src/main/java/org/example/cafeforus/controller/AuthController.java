package org.example.cafeforus.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.cafeforus.dto.request.LoginDto;
import org.example.cafeforus.dto.request.SignupDto;
import org.example.cafeforus.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        userService.register(dto);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDto dto, HttpServletRequest request) {

        try {
            Map<String, String> response = userService.login(dto, request);
            System.out.println("*********************");
            System.out.println(ResponseEntity.ok(response));
            System.out.println("*********************");

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
        try {
            // 서비스 호출로 로그아웃 처리
            userService.logout(request);
            return ResponseEntity.ok("로그아웃 성공");

        } catch (Exception e) {
            System.out.println("❌ 로그아웃 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("로그아웃 중 오류가 발생했습니다.");
        }
    }

    // 로그인 상태 확인용 API
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        try {
            // 서비스 호출로 인증된 사용자 정보 가져오기
            Map<String, String> userInfo = userService.getAuthenticatedUser();
            System.out.println("*********************");
            System.out.println(ResponseEntity.ok(userInfo));
            System.out.println("*********************");
            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 올바르지 않습니다.");
        }
    }


}