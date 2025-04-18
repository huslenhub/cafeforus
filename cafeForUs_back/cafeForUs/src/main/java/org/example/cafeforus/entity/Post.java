package org.example.cafeforus.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @ManyToOne
    private User author;

    @ManyToOne
    private Category category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}