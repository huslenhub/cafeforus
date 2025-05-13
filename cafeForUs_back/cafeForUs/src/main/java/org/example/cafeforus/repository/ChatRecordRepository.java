package org.example.cafeforus.repository;

import org.example.cafeforus.entity.ChatRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRecordRepository extends JpaRepository<ChatRecord, Long> {
    List<ChatRecord> findByUser1OrUser2(String user1, String user2);

    @Query("SELECT c FROM ChatRecord c " +
            "WHERE (c.user1 = :user1 AND c.user2 = :user2) " +
            "   OR (c.user1 = :user2 AND c.user2 = :user1)")
    Optional<ChatRecord> findChatRecordByUsers(@Param("user1") String user1,
                                               @Param("user2") String user2);}
