package org.example.cafeforus.service;

import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.response.UserActivityDto;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.repository.CommentRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public List<UserActivityDto> getAllUserActivities() {
        List<Users> users = userRepository.findAll();
        return users.stream()
                .map(user -> {
                    int postCount = postRepository.countByAuthor(user);
                    int commentCount = commentRepository.countByAuthor(user);
                    return new UserActivityDto(
                            user.getUsername(),
                            user.getEmail(),
                            postCount,
                            commentCount
                    );
                })
                .toList();
    }
}
