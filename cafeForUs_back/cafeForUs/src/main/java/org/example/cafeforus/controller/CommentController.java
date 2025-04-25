package org.example.cafeforus.controller;

import org.example.cafeforus.dto.CommentCreateRequest;
import org.example.cafeforus.dto.CommentDto;
import org.example.cafeforus.dto.CommentUpdateRequest;
import org.example.cafeforus.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    //댓글 작성
    @PostMapping("/")
    public ResponseEntity<CommentDto> createComment(
            @RequestBody CommentCreateRequest request,
            Principal principal) {
        String username = principal.getName(); // 세션 기반 로그인 사용자 이름
        CommentDto result = commentService.createComment(request,username);
        return ResponseEntity.ok(result);
    }

    //댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long id,
            @RequestBody CommentUpdateRequest request,
            Principal principal) {

        String username = principal.getName();  // 세션 기반 사용자 이름
        CommentDto result = commentService.updateComment(id, request, username);
        return ResponseEntity.ok(result);
    }

    //댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            Principal principal) {

        String username = principal.getName();  // 세션 기반 사용자 이름
        commentService.deleteComment(id, username);
        return ResponseEntity.noContent().build();
    }

    //대댓글
    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<CommentDto> createReply(
            @PathVariable Long parentCommentId,
            @RequestBody CommentCreateRequest request,
            Principal principal) {

        String username = principal.getName();
        CommentDto result = commentService.createReply(parentCommentId, request, username);
        return ResponseEntity.ok(result);
    }


}
