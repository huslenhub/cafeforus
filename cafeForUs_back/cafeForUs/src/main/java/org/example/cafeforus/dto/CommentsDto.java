package org.example.cafeforus.dto;

import lombok.Data;

import java.util.List;

@Data
public class CommentsDto {
    private int currentPage;
    private int totalPages;
    private List<CommentDto> comments;
}
