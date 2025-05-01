package org.example.cafeforus.service;


import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.response.CommentsDto;
import org.example.cafeforus.dto.response.PostDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.User;
import org.example.cafeforus.exception.FileStorageException;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.CategoryRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final CommentService commentService;

    // 댓글 조회
    public CommentsDto getCommentsByPost(Long postId, int page, int size) {
        return commentService.getCommentsByPostId(postId, page, size);
    }

    // 카테고리별 게시글 조회
    public List<Post> getPostsByCategory(Long categoryId) {
        return postRepository.findByCategoryId(categoryId);
    }

    // 게시글 검색
    public List<Post> searchPosts(String query, String filter) {
        return switch (filter) {
            case "title" -> postRepository.findByTitleContainingIgnoreCase(query);
            case "author" -> postRepository.findByAuthor_UsernameContainingIgnoreCase(query);
            default -> postRepository.findByContentContainingIgnoreCase(query);
        };
    }

    // 게시글 작성
    public Post createPost(PostDto body, MultipartFile image, String username) {
        User user = findUser(username);
        Category category = findCategory(body.getCategoryId());

        Post post = new Post();
        post.setTitle(body.getTitle());
        post.setContent(body.getContent());
        post.setCategory(category);
        post.setAuthor(user);

        if (image != null && !image.isEmpty()) {
            String savedPath = saveImage(image);
            post.setImagePath(savedPath);
        }

        return postRepository.save(post);
    }

    // 게시글 수정
    public Post updatePost(Long postId, PostDto body, MultipartFile image, String username) {
        Post post = findPost(postId);

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        Category category = findCategory(body.getCategoryId());

        post.setTitle(body.getTitle());
        post.setContent(body.getContent());
        post.setCategory(category);

        if (image != null && !image.isEmpty()) {
            String savedPath = saveImage(image);
            post.setImagePath(savedPath);
        }

        return postRepository.save(post);
    }

    // 게시글 삭제
    public void deletePost(Long postId, String username) {
        Post post = findPost(postId);
        User user = findUser(username);

        boolean isAuthor = post.getAuthor().getUsername().equals(username);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        postRepository.delete(post);
    }

    // 게시글 상세 조회
    public Post getPostDetail(Long postId) {
        Post post = findPost(postId);
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return post;
    }

    // 전체 게시글 조회
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 🔥 헬퍼 메서드 (중복 제거용)

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));
    }

    private Category findCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다."));
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
    }

    private String saveImage(MultipartFile image) {
        try {
            return fileService.saveFile(image);
        } catch (IOException e) {
            throw new FileStorageException("파일 저장에 실패했습니다.", e);
        }
    }
}
