package com.voleiprea.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 4)
    private String pin; // PIN de 4 dígitos para segurança simples

    private Integer age;

    @Column(name = "match_count", nullable = false)
    private Integer matchCount = 0; // Valor default garantido

    @Column(nullable = false)
    private Integer score = 0; // Nível de habilidade inicial
}