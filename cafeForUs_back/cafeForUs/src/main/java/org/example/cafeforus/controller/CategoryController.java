package org.example.cafeforus.controller;

import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.CategoryDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.CategoryRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // 모든 카테고리 조회
    @GetMapping("/all")
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // 카테고리 ID로 카테고리 정보 조회
    @GetMapping("/name/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 카테고리를 찾을 수 없습니다.");
        }
    }

    // 카테고리 생성 (관리자만 접근 가능)
    @PostMapping("/add")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Users users = getAuthenticatedUser(principal);
        if (users.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 카테고리를 생성할 수 있습니다.");
        }

        Category category = new Category();
        category.setName(body.getName());
        category.setRole(resolveRole(body.getRole()));
        category.setCreatedBy(users);

        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }

    // 카테고리 삭제 (관리자만 접근 가능)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Users users = getAuthenticatedUser(principal);
        if (users.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 카테고리를 삭제할 수 있습니다.");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        categoryRepository.delete(category);
        return ResponseEntity.ok("카테고리가 성공적으로 삭제되었습니다.");
    }

    // 카테고리 수정 (관리자만 접근 가능)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryDto body, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Users users = getAuthenticatedUser(principal);
        if (users.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 카테고리를 수정할 수 있습니다.");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        category.setName(body.getName());
        category.setRole(resolveRole(body.getRole()));
        category.setCreatedBy(users);

        categoryRepository.save(category);
        return ResponseEntity.ok("카테고리가 성공적으로 수정되었습니다.");
    }

    // 인증된 유저 정보를 가져오는 메서드
    private Users getAuthenticatedUser(Principal principal) {
        String username = principal.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    // 역할을 안전하게 처리하는 메서드 (기본값: USER)
    private Role resolveRole(String role) {
        if (role == null || role.isEmpty()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("잘못된 역할 값입니다.");
        }
    }
}
