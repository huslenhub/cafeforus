package org.example.cafeforus.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.example.cafeforus.entity.Post;

@Getter
@Setter
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private String categoryName;
    private int views;
    private String imagePath;

    public static PostResponseDto fromEntity(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthorName(post.getAuthor().getUsername()); // 또는 getName()
        dto.setCategoryName(post.getCategory().getName());
        dto.setViews(post.getViews());
        dto.setImagePath(post.getImagePath());
        return dto;
    }
}
