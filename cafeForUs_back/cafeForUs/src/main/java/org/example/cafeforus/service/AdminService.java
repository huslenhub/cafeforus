package org.example.cafeforus.service;

import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.response.PostAllDto;
import org.example.cafeforus.dto.response.PostResponseDto;
import org.example.cafeforus.dto.response.UserActivityDto;
import org.example.cafeforus.dto.response.UserResponseDto;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.repository.CommentRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getLevel().name(),   // Enum to String
                        user.getRole().name(),    // Enum to String
                        user.getPostCount(),
                        user.getCommentCount()
                ))
                .collect(Collectors.toList());
    }

    public List<PostAllDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> PostAllDto.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .author(post.getAuthor().getUsername()) // 또는 getNickname() 등
                        .views(post.getViews())
                        .commentCount(post.getCommentCount())
                        .build())
                .collect(Collectors.toList());
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }



}
