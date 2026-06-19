package com.voleiprea.api.dto;

import java.util.List;
import java.util.UUID;

public record PlayerDraftDTO(UUID id, String name, Integer originalScore) {}