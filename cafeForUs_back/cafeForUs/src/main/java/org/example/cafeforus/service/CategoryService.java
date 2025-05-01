package org.example.cafeforus.service;

import org.example.cafeforus.dto.request.CategoryDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.model.Level;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.CategoryRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // 모든 카테고리 조회
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // 카테고리 ID로 카테고리 정보 조회
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
    }

    // 카테고리 생성 (관리자만 접근 가능)성공
    public Category createCategory(CategoryDto body, Principal principal) {
        User users = getAuthenticatedUser(principal);
        System.out.println("users: " + users );
        System.out.println("name: " + body.getName() + ", 읽기 권한 " + body.getMinRLevel() + ", 쓰기 권환: " + body.getMinWLevel());
        if (users.getRole() != Role.ADMIN) {
            throw new RuntimeException("관리자만 카테고리를 생성할 수 있습니다.");
        }

        Category category = new Category();
        category.setName(body.getName());
        category.setMinReadLevel(Level.formString(body.getMinRLevel()));
        category.setMinWriteLevel(Level.formString(body.getMinWLevel()));
        category.setCreatedBy(users);

        System.out.println("생성된 카테고리: " +category);
        return categoryRepository.save(category);
    }

    // 카테고리 삭제 (관리자만 접근 가능)성공
    public void deleteCategory(Long id, Principal principal) {
        User users = getAuthenticatedUser(principal);

        if (users.getRole() != Role.ADMIN) {
            throw new RuntimeException("관리자만 카테고리를 삭제할 수 있습니다.");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        categoryRepository.delete(category);
    }

    // 카테고리 수정 (관리자만 접근 가능)
    public void updateCategory(Long id, CategoryDto body, Principal principal) {
        User users = getAuthenticatedUser(principal);
        System.out.println("users: " + users );
        System.out.println("name: " + body.getName() + ", 읽기 권한 " + body.getMinRLevel() + ", 쓰기 권환: " + body.getMinWLevel());
        if (users.getRole() != Role.ADMIN) {

            throw new RuntimeException("관리자만 카테고리를 수정할 수 있습니다.");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));

        category.setName(body.getName());
        category.setMinReadLevel(Level.formString(body.getMinRLevel()));
        category.setMinWriteLevel(Level.formString(body.getMinWLevel()));
        category.setCreatedBy(users);

        System.out.println("여기까지 성공");
        categoryRepository.save(category);
    }

    // 인증된 유저 정보를 가져오는 메서드
    private User getAuthenticatedUser(Principal principal) {
        String username = principal.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }


}
