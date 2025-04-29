package org.example.cafeforus.exception;

/**
 * 리소스를 찾을 수 없을 때 발생하는 예외
 * 예시: 게시글, 유저, 카테고리 등 DB에 없는 경우
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}