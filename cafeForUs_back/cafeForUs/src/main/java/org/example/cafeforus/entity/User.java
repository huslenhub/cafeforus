package org.example.cafeforus.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.cafeforus.model.Role;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // 기본값

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                // 보안을 위해 password는 절대 로그에 찍지 않습니다
                '}';
    }
}
