package org.example.cafeforus.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    @ManyToOne
    private Users author;  // 게시글 작성자

    @NotBlank
    @ManyToOne
    private Category category;

    @NotBlank
    private LocalDateTime createdAt;

    private String imagePath;  // 파일 경로 저장 필드

    private int views = 0; // 기본값 0

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }



}
