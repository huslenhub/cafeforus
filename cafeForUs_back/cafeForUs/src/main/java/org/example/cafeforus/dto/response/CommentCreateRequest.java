package org.example.cafeforus.dto.response;

import lombok.Data;

@Data

public class CommentCreateRequest {
    private Long postId;
    private String content;
}
