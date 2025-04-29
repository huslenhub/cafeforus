package org.example.cafeforus.dto;

import lombok.Data;

@Data
public class PostDto {
    private String title;
    private String content;
    private Long categoryId;
}
