package org.example.cafeforus.controller;

import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.request.CategoryDto;
import org.example.cafeforus.dto.response.PostAllDto;
import org.example.cafeforus.dto.response.PostResponseDto;
import org.example.cafeforus.dto.response.UserResponseDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.service.AdminService;
import org.example.cafeforus.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CategoryService categoryService;

    @GetMapping("/all/user")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        System.out.println("요청들어옴");
        List<UserResponseDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/all/post")
    public ResponseEntity<List<PostAllDto>> getAllPosts() {
        return ResponseEntity.ok(adminService.getAllPosts());
    }
    @DeleteMapping("/post/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    //카테고리 추가
    @PostMapping("/category/add")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto body, Principal principal) {
        try {
            Category category = categoryService.createCategory(body, principal);
            System.out.println("성공");
            System.out.println(ResponseEntity.status(HttpStatus.CREATED).body(category));
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (RuntimeException e) {
            System.out.println("에러 발생");
            System.out.println(ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()));
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    // 카테고리 삭제 (관리자만 접근 가능)
    @DeleteMapping("/category/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, Principal principal) {
        try {
            categoryService.deleteCategory(id, principal);
            return ResponseEntity.ok("카테고리가 성공적으로 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    // 카테고리 수정
    @PutMapping("/category/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryDto body, Principal principal) {
        try {
            categoryService.updateCategory(id, body, principal);

            return ResponseEntity.ok("카테고리가 성공적으로 수정되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
