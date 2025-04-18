package org.example.cafeforus.repository;

import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
//public interface CategoryRepository extends JpaRepository<Category, Long> {}
//
//public interface PostRepository extends JpaRepository<Post, Long> {}