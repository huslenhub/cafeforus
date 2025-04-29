package org.example.cafeforus.exception;

/**
 * 인증이 실패했을 때 발생하는 예외
 * 예시: 로그인하지 않은 사용자가 요청을 보낼 때
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}