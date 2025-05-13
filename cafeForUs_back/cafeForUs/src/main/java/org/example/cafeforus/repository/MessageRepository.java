package org.example.cafeforus.repository;

import org.example.cafeforus.entity.ChatRecord;
import org.example.cafeforus.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRecordOrderByTimestampAsc(ChatRecord chatRecord);
}