package org.example.cafeforus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String level;
    private String role;
    private int postCount;
    private int commentCount;
}
