package org.example.cafeforus.service;

import org.example.cafeforus.entity.Category;
import org.example.cafeforus.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    // 카테고리 ID로 카테고리 정보 조회
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
    }
}
