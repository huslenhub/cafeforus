package org.example.cafeforus.exception;

/**
 * 클라이언트에 전달할 에러 응답 형식
 * {
 *    "code": "에러 코드",
 *    "message": "에러 메시지"
 * }
 */

/**
 * 에러 응답 DTO
 */
public class ErrorResponse {

    private String code;
    private String message;

    public ErrorResponse(ErrorCode errorCode) {
        this.code = errorCode.name(); // Enum 이름을 코드로 사용
        this.message = errorCode.getMessage();
    }

    // 추가적으로 직접 메시지를 덮어쓸 수 있는 생성자
    public ErrorResponse(ErrorCode errorCode, String customMessage) {
        this.code = errorCode.name();
        this.message = customMessage;
    }

    // Getter
    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
