package org.example.cafeforus.controller;

import org.example.cafeforus.dto.response.CategoryAllResponseDto;
import org.example.cafeforus.dto.response.CategoryResponseOnebyOne;
import org.example.cafeforus.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // 모든 카테고리 조회
    @GetMapping("/all")
    public List<CategoryAllResponseDto> getAll() {
        return categoryService.getAllCategories();
    }

    // 카테고리 ID로 카테고리 정보 조회
    @GetMapping("/name/{categoryId}")
    public ResponseEntity<CategoryResponseOnebyOne> getCategoryById(@PathVariable Long categoryId) {
        try {
            CategoryResponseOnebyOne response = categoryService.getCategorySummaryById(categoryId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
