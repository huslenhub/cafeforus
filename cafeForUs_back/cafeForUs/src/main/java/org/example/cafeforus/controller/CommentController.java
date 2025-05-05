package org.example.cafeforus.controller;

import org.example.cafeforus.dto.response.CommentCreateRequest;
import org.example.cafeforus.dto.response.CommentDto;
import org.example.cafeforus.dto.request.CommentUpdateRequest;
import org.example.cafeforus.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    // 생성자 주입
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    // 댓글 작성
    @PostMapping("/")
    public ResponseEntity<?> createComment(
            @RequestBody CommentCreateRequest request,
            Principal principal) {
        try {
            String username = principal.getName();
            CommentDto result = commentService.createComment(request, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody CommentUpdateRequest request,
            Principal principal) {
        try {
            String username = principal.getName();
            CommentDto result = commentService.updateComment(id, request, username);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            Principal principal) {
        try {
            String username = principal.getName();
            commentService.deleteComment(id, username);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 대댓글 작성
    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<?> createReply(
            @PathVariable Long parentCommentId,
            @RequestBody CommentCreateRequest request,
            Principal principal) {
        try {
            String username = principal.getName();
            CommentDto result = commentService.createReply(parentCommentId, request, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
