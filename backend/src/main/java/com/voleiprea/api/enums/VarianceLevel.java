package com.voleiprea.api.enums;

import lombok.Getter;

@Getter
public enum VarianceLevel {
    LOW(5),     // Altera pouco a posição relativa
    MEDIUM(15), // Cria algumas surpresas justas
    HIGH(30);   // Bagunça a fila consideravelmente

    private final int factor;

    VarianceLevel(int factor) {
        this.factor = factor;
    }
}