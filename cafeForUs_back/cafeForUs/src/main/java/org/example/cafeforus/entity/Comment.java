package org.example.cafeforus.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // 어떤 게시글에 달린 댓글인지
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)  // 댓글 작성자
    @JoinColumn(name = "user_id")
    private Users user;

    private String content;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;  // 대댓글의 부모 댓글

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

