package org.example.cafeforus.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private String sender;
    private String receiver;
    private String message;
}
