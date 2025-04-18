package org.example.cafeforus.dto;

import lombok.Data;

@Data
public class SignupDto {
    private String username;
    private String password;
    private String email;

    @Override
    public String toString() {
        return "SignupDto{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +  // 주의: 실무에서는 비밀번호 출력 지양
                ", email='" + email + '\'' +
                '}';
    }
}
