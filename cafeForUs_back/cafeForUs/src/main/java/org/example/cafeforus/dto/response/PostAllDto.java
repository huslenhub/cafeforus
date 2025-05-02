package org.example.cafeforus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class PostAllDto {
    private Long id;
    private String title;
    private String author;
    private int views;
    private int commentCount;
}
