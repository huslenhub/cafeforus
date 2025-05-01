package org.example.cafeforus.repository;

import org.example.cafeforus.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepository extends JpaRepository<Category, Long> {
}

