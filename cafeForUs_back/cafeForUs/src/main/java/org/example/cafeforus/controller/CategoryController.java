package org.example.cafeforus.controller;

import org.example.cafeforus.dto.request.CategoryDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    // 카테고리 ID로 카테고리 정보 조회
    @GetMapping("/name/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long categoryId) {
        try {
            Category category = categoryService.getCategoryById(categoryId);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 카테고리 생성 (관리자만 접근 가능)
    @PostMapping("/add")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto body, Principal principal) {
        try {
            Category category = categoryService.createCategory(body, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 카테고리 삭제 (관리자만 접근 가능)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, Principal principal) {
        try {
            categoryService.deleteCategory(id, principal);
            return ResponseEntity.ok("카테고리가 성공적으로 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 카테고리 수정 (관리자만 접근 가능)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryDto body, Principal principal) {
        try {
            categoryService.updateCategory(id, body, principal);
            return ResponseEntity.ok("카테고리가 성공적으로 수정되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
