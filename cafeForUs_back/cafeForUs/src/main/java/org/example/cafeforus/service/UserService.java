package org.example.cafeforus.service;

import org.example.cafeforus.dto.SignupDto;
import org.example.cafeforus.entity.Users;
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

        Users users = new Users();
        users.setUsername(dto.getUsername());
        System.out.println(">>> password: " + dto.getPassword());
        users.setPassword(passwordEncoder.encode(dto.getPassword()));
        users.setEmail(dto.getEmail());
        userRepository.save(users);
    }

    // UserService.java
    public Users authenticate(String username, String password) {
        Users users = userRepository.findByUsername(username)
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
}