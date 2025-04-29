package org.example.cafeforus.service;

import org.example.cafeforus.dto.response.CommentCreateRequest;
import org.example.cafeforus.dto.response.CommentDto;
import org.example.cafeforus.dto.request.CommentUpdateRequest;
import org.example.cafeforus.dto.response.CommentsDto;
import org.example.cafeforus.entity.Comment;
import org.example.cafeforus.entity.Post;
import org.example.cafeforus.entity.Users;
import org.example.cafeforus.repository.CommentRepository;
import org.example.cafeforus.repository.PostRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    // 생성자 주입
    public CommentService(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    // 댓글 생성
    public CommentDto createComment(CommentCreateRequest req, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setAuthor(user);
        comment.setPost(post);
        comment.setContent(req.getContent());

        commentRepository.save(comment);

        return CommentDto.fromEntity(comment);
    }

    // 댓글 수정
    public CommentDto updateComment(Long commentId, CommentUpdateRequest request, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // 댓글 작성자만 수정 가능
        if (!comment.getAuthor().equals(username)) {
            throw new RuntimeException("Unauthorized access");
        }

        comment.setContent(request.getContent());
        commentRepository.save(comment);

        return CommentDto.fromEntity(comment);
    }

    // 댓글 삭제
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // 댓글 작성자만 삭제 가능
        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized access");
        }

        commentRepository.delete(comment);
    }

    // 대댓글 생성
    public CommentDto createReply(Long commentId, CommentCreateRequest request, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        Comment reply = new Comment();
        reply.setAuthor(user);
        reply.setPost(post);
        reply.setContent(request.getContent());
        reply.setParentComment(parentComment);

        commentRepository.save(reply);

        return CommentDto.fromEntity(reply);
    }

    // 댓글 목록 조회 (페이징)
    public CommentsDto getCommentsByPostId(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

        List<CommentDto> commentDtos = commentPage.getContent()
                .stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());

        CommentsDto response = new CommentsDto();
        response.setCurrentPage(commentPage.getNumber());
        response.setTotalPages(commentPage.getTotalPages());
        response.setComments(commentDtos);
        return response;
    }
}

