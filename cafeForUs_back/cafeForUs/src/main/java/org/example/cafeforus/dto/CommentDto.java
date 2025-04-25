package org.example.cafeforus.dto;

import lombok.Data;
import org.example.cafeforus.entity.Comment;

import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private String writer;
    private LocalDateTime createdAt;

    public static CommentDto fromEntity(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setWriter(comment.getUser().getUsername()); // Users 클래스에 맞춰 조정
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }

}
