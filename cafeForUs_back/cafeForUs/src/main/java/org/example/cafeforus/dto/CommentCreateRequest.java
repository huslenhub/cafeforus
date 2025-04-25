package org.example.cafeforus.dto;

import lombok.Data;

@Data
public class CommentCreateRequest {
    private Long postId;
    private String content;
}
