package org.example.cafeforus.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.cafeforus.model.Role;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    private Users createdBy; // admin 계정

    @Enumerated(EnumType.STRING)
    private Role role; // USER 또는 ADMIN
}
