package org.example.cafeforus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.cafeforus.entity.Category;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@Data
@AllArgsConstructor //의미
public class CategoryResponseOnebyOne {
    private String name;
    private String minWriteLevel;
    private String minReadLevel;
}
