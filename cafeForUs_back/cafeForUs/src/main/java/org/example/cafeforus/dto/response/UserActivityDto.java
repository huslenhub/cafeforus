package org.example.cafeforus.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserActivityDto {
    private String username;
    private String email;
    private String level;
    private int postCount;
    private int commentCount;

    public UserActivityDto(String username, String email, int postCount, int commentCount) {
        this.username = username;
        this.email = email;
        this.postCount = postCount;
        this.commentCount = commentCount;
    }
}
