package org.example.cafeforus.exception;

/**
 * 파일 저장 관련 에러가 발생했을 때 던지는 사용자 정의 예외
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}