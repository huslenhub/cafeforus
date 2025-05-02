package org.example.cafeforus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor //의미
public class CategoryAllResponseDto {
    private Long id;
    private String name;
    private String minReadLevel;
    private String minWriteLevel;
    private int postcount;
}
