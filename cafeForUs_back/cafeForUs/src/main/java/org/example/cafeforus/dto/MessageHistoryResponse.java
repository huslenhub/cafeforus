package org.example.cafeforus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageHistoryResponse {
    private List<MessageHistoryEntry> messages;
}



