package org.example.cafeforus.service;

import jakarta.transaction.Transactional;
import org.example.cafeforus.dto.SignupDto;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


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

        User user = new User();
        user.setUsername(dto.getUsername());
        System.out.println(">>> password: " + dto.getPassword());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        userRepository.save(user);
    }

    // UserService.java
    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        if (user == null) {
            System.out.println("🔍 User not found: " + username);
            throw new IllegalArgumentException("아이디가 존재하지 않습니다.");
        }

        // 비밀번호 비교 (암호화된 비밀번호와 평문 비밀번호를 비교)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("🔍 Incorrect password for user: " + username);
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        } else {
            System.out.println("비밀 번호가 일치 합니다.");
        }

        return user;
    }
}