package org.example.cafeforus.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Post post;

    @ManyToOne
    private User author;

    @NotBlank
    private String content;

    private LocalDateTime createdAt;

    @ManyToOne
    private Comment parentComment;  // 대댓글의 부모 댓글

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}



