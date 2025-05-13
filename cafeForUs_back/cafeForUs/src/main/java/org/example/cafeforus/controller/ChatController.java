package org.example.cafeforus.controller;


import org.example.cafeforus.dto.*;
import org.example.cafeforus.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // 1. 유저 존재 여부 확인
    @GetMapping("/user-exists/{username}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
        boolean exists = chatService.userExists(username);
        return ResponseEntity.ok(exists);
    }

    // 2. 채팅 기록 가져오기 (채팅방과 마지막 메시지 포함)
    @GetMapping("/history/{username}")
    public ResponseEntity<ChatHistoryResponse> getChatHistory(@PathVariable String username) {
        ChatHistoryResponse chatHistory = chatService.getChatHistory(username);
        System.out.println("chatHistory: " + chatHistory);
        return ResponseEntity.ok(chatHistory);
    }

    // 3. 채팅방의 메시지 목록 가져오기
    @GetMapping("/messages/{sender}/{receiver}")
    public ResponseEntity<MessageHistoryResponse> getMessagesForChat(@PathVariable String sender, @PathVariable String receiver) {
        MessageHistoryResponse messageHistoryResponse = chatService.getMessagesForChat(sender, receiver);
        System.out.println(" 3.채팅방의 메시지 목록: "+ResponseEntity.ok(messageHistoryResponse));
        return ResponseEntity.ok(messageHistoryResponse);
    }



    // 4. 메시지 보내기
    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody SendMessageRequest request) {
        System.out.println("request: "+request);
        chatService.sendMessage(request);
        return ResponseEntity.ok().build();
    }
}
