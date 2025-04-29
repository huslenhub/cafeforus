package org.example.cafeforus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.response.CommentsDto;
import org.example.cafeforus.dto.response.PostDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.CategoryRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.example.cafeforus.service.CommentService;
import org.example.cafeforus.service.FileService;
import org.example.cafeforus.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;


//    private final PostRepository postRepository;
//    private final CategoryRepository categoryRepository;
//    private final UserRepository userRepository;
//    private final FileService fileService;
//    private final CommentService commentService;

    //댓글 불러오기
    @GetMapping("/comments/{postID}")
    public ResponseEntity<CommentsDto> getCommentsByPost(
            @PathVariable Long postID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getCommentsByPost(postID, page, size));
    }

    // 카테고리별 게시글 조회
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Post>> getPostsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(postService.getPostsByCategory(categoryId));
    }

    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "content") String filter) {
        return ResponseEntity.ok(postService.searchPosts(query, filter));
    }

    // 게시글 작성
    @PostMapping("/write")
    public ResponseEntity<?> createPost(
            @Valid @RequestPart("postDto") PostDto body,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(body, image, principal.getName()));
    }

    // 게시글 수정
    @PutMapping(value = "/update/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @Valid @RequestPart("postDto") PostDto body,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Principal principal) {
        return ResponseEntity.ok(postService.updatePost(postId, body, image, principal.getName()));
    }

    // 게시글 삭제
    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            Principal principal) {
        postService.deletePost(postId, principal.getName());
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    // 게시글 상세 조회
    @GetMapping("/read/{postId}")
    public ResponseEntity<?> getPostDetail(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostDetail(postId));
    }

    // 전체 게시글 조회
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
}
