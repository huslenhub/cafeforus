package org.example.cafeforus.repository;

import org.example.cafeforus.entity.Comment;
import org.example.cafeforus.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostId(Long postId, Pageable pageable);
    int countByAuthor(User user);
}
