package org.example.cafeforus.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.cafeforus.model.Level;

@Entity
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @ManyToOne
    private User createdBy; // 관리자 계정 (User)

    @Enumerated(EnumType.STRING)
    private Level minReadLevel; // 해당 카테고리 접근 권한을 가진 역할 (USER 또는 ADMIN)

    @Enumerated(EnumType.STRING)
    private Level minWriteLevel;  // 해당 카테고리에 접근 가능한 사용자 레벨 (BASIC, SILVER, GOLD, VIP 등)

}

