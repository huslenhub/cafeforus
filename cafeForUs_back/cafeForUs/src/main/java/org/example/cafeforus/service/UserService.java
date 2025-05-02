package org.example.cafeforus.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.cafeforus.dto.request.LoginDto;
import org.example.cafeforus.dto.request.SignupDto;
import org.example.cafeforus.dto.response.LoginResponseDto;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.model.Level;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(SignupDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다");
        }

        User users = new User();
        users.setUsername(dto.getUsername());
        System.out.println(">>> password: " + dto.getPassword());
        users.setPassword(passwordEncoder.encode(dto.getPassword()));
        users.setEmail(dto.getEmail());
        users.setRole(Role.USER);
        users.setLevel(Level.BASIC);
        userRepository.save(users);
    }

    public void logout(HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession(false);  // 기존 세션을 가져옴
        if (session != null) {
            session.invalidate();  // 세션 무효화
        } else {
            throw new Exception("세션이 존재하지 않습니다.");
        }
    }

    // UserService.java
    public User authenticate(String username, String password) {
        User users = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        if (users == null) {
            System.out.println("🔍 Users not found: " + username);
            throw new IllegalArgumentException("아이디가 존재하지 않습니다.");
        }

        // 비밀번호 비교 (암호화된 비밀번호와 평문 비밀번호를 비교)
        if (!passwordEncoder.matches(password, users.getPassword())) {
            System.out.println("🔍 Incorrect password for users: " + username);
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        } else {
            System.out.println("비밀 번호가 일치 합니다.");
        }

        return users;
    }
    // service/UserService.java
    public LoginResponseDto login(LoginDto dto, HttpServletRequest request){
        User users = authenticate(dto.getUsername(), dto.getPassword());

        // 권한 설정
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + users.getRole().name());

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(users, null, List.of(authority));

        // 보안 컨텍스트 저장
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        // 세션 저장
        HttpSession session = request.getSession(true);
        session.setAttribute("user", users);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        // DTO로 응답
        return new LoginResponseDto(users.getUsername(), users.getLevel().name());
    }

    public LoginResponseDto getAuthenticatedUser() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User users)) {
            throw new Exception("로그인 정보가 올바르지 않습니다.");
        }

        return new LoginResponseDto(users.getUsername(), users.getLevel().name());
    }
}