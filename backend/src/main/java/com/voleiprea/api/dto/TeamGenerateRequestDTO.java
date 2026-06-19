package com.voleiprea.api.dto;

import com.voleiprea.api.enums.VarianceLevel;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record TeamGenerateRequestDTO(
    @NotEmpty(message = "A lista de IDs dos jogadores não pode estar vazia.")
    @Size(min = 4, message = "É necessário um mínimo de 4 jogadores para gerar times.")
    List<UUID> playerIds,

    @NotNull(message = "O nível de variância (LOW, MEDIUM, HIGH) é obrigatório.")
    VarianceLevel variance
) {}