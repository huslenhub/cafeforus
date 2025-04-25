package org.example.cafeforus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.cafeforus.dto.CommentsDto;
import org.example.cafeforus.dto.PostDto;
import org.example.cafeforus.entity.Category;
import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.model.Role;
import org.example.cafeforus.repository.CategoryRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.example.cafeforus.service.CommentService;
import org.example.cafeforus.service.FileService;
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

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final CommentService commentService;

    //댓글 불러오기
    @GetMapping("/comments/{postID}")
    public ResponseEntity<CommentsDto> getCommentsByPost(
            @PathVariable Long postID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        CommentsDto result = commentService.getCommentsByPostId(postID, page, size);

        return ResponseEntity.ok(result);
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Post>> getPostsByCategory(@PathVariable Long categoryId) {
        List<Post> posts = postRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(@RequestParam String query, @RequestParam(defaultValue = "content") String filter) {
        List<Post> results = switch (filter) {
            case "title" -> postRepository.findByTitleContainingIgnoreCase(query);
            case "author" -> postRepository.findByAuthor_UsernameContainingIgnoreCase(query);
            default -> postRepository.findByContentContainingIgnoreCase(query);
        };
        return ResponseEntity.ok(results);
    }



    // 글 생성 (POST) 백엔드에서는 이렇게 했어
    @PostMapping("write")
    public ResponseEntity<?> createPost(
            @Valid @RequestPart("postDto") PostDto body,  // DTO 검증 추가
            @RequestPart(value = "image", required = false) MultipartFile image,  // 이미지 파일
            Principal principal
    ) {
        // 현재 로그인한 사용자의 username 가져오기
        String username = principal.getName();

        // 사용자 정보 확인 (DB에서 찾기)
        Users users = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));

        // 카테고리 정보 확인 (DB에서 찾기)
        Category category = categoryRepository.findById(body.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다."));

        // Post 객체 생성
        Post post = new Post();
        post.setTitle(body.getTitle());
        post.setContent(body.getContent());
        post.setCategory(category);
        post.setAuthor(users);

        // 이미지 파일이 있는 경우, 파일을 서버에 저장하고 경로를 Post 객체에 설정
        if (image != null && !image.isEmpty()) {
            String savedPath = saveImage(image);  // 파일 저장 로직 호출
            post.setImagePath(savedPath);  // Post 객체에 파일 경로 저장
        }

        // Post 객체를 DB에 저장
        postRepository.save(post);

        // 성공적인 응답 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(post);  // 생성된 게시글을 반환
    }

    // 이미지 저장 로직을 별도의 메서드로 분리
    private String saveImage(MultipartFile image) {
        try {
            return fileService.saveFile(image);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장에 실패했습니다.", e);
        }
    }


    // 글 수정 (작성자만 가능)
    @PutMapping(value = "/update/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @Valid @RequestPart("postDto") PostDto body,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Principal principal
    ) {
        String username = principal.getName();

        // 유저 정보 확인
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));

        // 기존 글 찾기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        // 작성자가 본인이 아니면 수정 불가
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 카테고리 확인 및 설정
        Category category = categoryRepository.findById(body.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다."));

        post.setTitle(body.getTitle());
        post.setContent(body.getContent());
        post.setCategory(category);

        // 이미지가 새로 업로드된 경우 덮어쓰기
        if (image != null && !image.isEmpty()) {
            String savedPath = saveImage(image);
            post.setImagePath(savedPath);
        }

        // 게시글 저장 (업데이트)
        postRepository.save(post);

        return ResponseEntity.ok(post); // 수정된 게시글 반환
    }



    // 글 삭제 (작성자 또는 관리자만 가능)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Principal principal) {
        // 게시글을 조회합니다.
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        // 로그인된 사용자의 정보를 가져옵니다.
        String currentUser = principal.getName();
        Users user = userRepository.findByUsername(currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));

        // 작성자와 로그인된 사용자가 일치하거나, 관리자인 경우 삭제 권한을 허용합니다.
        boolean isAuthor = post.getAuthor().getUsername().equals(currentUser);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        // 게시글을 삭제합니다.
        postRepository.delete(post);

        // 삭제 성공 후 메시지를 클라이언트에게 전달
        return ResponseEntity.ok().body("게시글이 삭제되었습니다.");
    }


    @GetMapping("/read/{id}")
    public ResponseEntity<?> getPostDetail(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        post.setViews(post.getViews() + 1); // ✅ 조회수 증가
        postRepository.save(post);

        return ResponseEntity.ok(post);
    }



    // 전체 글 목록 조회
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
