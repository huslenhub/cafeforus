package org.example.cafeforus.exception;

/**
 * 인가(권한)이 실패했을 때 발생하는 예외
 * 예시: 다른 사용자의 글을 수정하려 할 때
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}