package org.example.cafeforus.service;

import org.example.cafeforus.dto.*;
import org.example.cafeforus.entity.ChatRecord;
import org.example.cafeforus.entity.Message;
import org.example.cafeforus.repository.ChatRecordRepository;
import org.example.cafeforus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRecordRepository chatRecordRepository;
    private final UserRepository userRepository;

    public ChatService(ChatRecordRepository chatRecordRepository, UserRepository userRepository) {
        this.chatRecordRepository = chatRecordRepository;
        this.userRepository = userRepository;
    }

    // 1. 유저 존재 여부 확인
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    // 2. 채팅 기록 가져오기 (채팅방과 마지막 메시지 포함)
    public ChatHistoryResponse getChatHistory(String username) {
        List<ChatRecord> records = chatRecordRepository.findByUser1OrUser2(username, username);
        List<ChatHistoryEntry> entries = new ArrayList<>();

        for (ChatRecord record : records) {
            String otherUser = record.getUser1().equals(username) ? record.getUser2() : record.getUser1();
            Message lastMessage = record.getMessages().stream()
                    .max(Comparator.comparing(Message::getTimestamp))
                    .orElse(null);
            String lastContent = lastMessage != null ? lastMessage.getContent() : "No messages yet";

            entries.add(new ChatHistoryEntry(otherUser, lastContent));
        }

        return new ChatHistoryResponse(entries);
    }

    // 3. 채팅방의 메시지 목록 가져오기
    // 서비스 부분 수정
    public MessageHistoryResponse getMessagesForChat(String sender, String receiver) {
        // 채팅 기록 조회
        ChatRecord chatRecord = chatRecordRepository
                .findChatRecordByUsers(sender, receiver)
                .orElseThrow(() -> new IllegalArgumentException("No chat record found"));

        // 메시지 목록 변환 및 정렬
        List<MessageHistoryEntry> entries = chatRecord.getMessages().stream()
                .sorted(Comparator.comparing(Message::getTimestamp)) // 시간 기준 정렬
                .map(message -> new MessageHistoryEntry(
                        message.getId(), // 메시지 ID
                        message.getSender(), // 보낸 사람
                        message.getReceiver(), // 받은 사람
                        message.getContent() // 메시지 내용
                ))
                .collect(Collectors.toList());

        // MessageHistoryResponse 생성 후 반환
        return new MessageHistoryResponse(entries);
    }


    // 4. 메시지 보내기
    public void sendMessage(SendMessageRequest request) {
        ChatRecord chatRecord = chatRecordRepository
                .findChatRecordByUsers(request.getSender(), request.getReceiver())
                .orElseGet(() -> {
                    ChatRecord newChatRecord = new ChatRecord();
                    newChatRecord.setUser1(request.getSender());
                    newChatRecord.setUser2(request.getReceiver());
                    newChatRecord.setCreatedAt(LocalDateTime.now());
                    return chatRecordRepository.save(newChatRecord);
                });

        Message message = new Message();
        message.setSender(request.getSender());
        message.setReceiver(request.getReceiver());
        message.setContent(request.getMessage());
        message.setChatRecord(chatRecord);
        message.setTimestamp(LocalDateTime.now());

        chatRecord.getMessages().add(message);
        chatRecordRepository.save(chatRecord);
    }
}
