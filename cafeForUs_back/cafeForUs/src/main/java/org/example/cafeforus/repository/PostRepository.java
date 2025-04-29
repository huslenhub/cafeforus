package org.example.cafeforus.repository;

import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCategoryId(Long categoryId);
    List<Post> findByTitleContainingIgnoreCase(String title);
    List<Post> findByContentContainingIgnoreCase(String content);
    List<Post> findByAuthor_UsernameContainingIgnoreCase(String username);
    int countByAuthor(Users user);

}
