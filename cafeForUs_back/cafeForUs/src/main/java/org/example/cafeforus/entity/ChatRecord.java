package org.example.cafeforus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user1;
    private String user2;

    @OneToMany(mappedBy = "chatRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude  // 🔥 이 필드 제외
    private List<Message> messages = new ArrayList<>(); // ✅ 반드시 초기화

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
