package org.example.cafeforus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatHistoryEntry {
    private String username;
    private String lastMessage;
}
