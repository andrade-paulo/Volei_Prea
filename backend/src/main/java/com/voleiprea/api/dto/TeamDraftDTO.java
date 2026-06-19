package com.voleiprea.api.dto;

import java.util.List;

public record TeamDraftDTO(String name, List<PlayerDraftDTO> players, Integer totalScore) {}