package org.example.cafeforus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageHistoryEntry {
    private Long id;
    private String sender;
    private String receiver;
    private String content;
}
