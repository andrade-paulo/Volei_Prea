package com.voleiprea.api.controller;

import com.voleiprea.api.dto.TeamDraftDTO;
import com.voleiprea.api.dto.TeamGenerateRequestDTO;
import com.voleiprea.api.service.TeamBalancingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Necessário para evitar bloqueios de CORS do Next.js no ambiente de desenvolvimento Docker
public class TeamController {

    private final TeamBalancingService teamBalancingService;

    @PostMapping("/generate")
    public ResponseEntity<List<TeamDraftDTO>> generateTeams(@Valid @RequestBody TeamGenerateRequestDTO request) {
        
        // O Controller delega imediatamente o trabalho pesado para a camada de Serviço
        List<TeamDraftDTO> draftedTeams = teamBalancingService.generateTeams(
            request.playerIds(),
            request.variance()
        );

        // Retorna HTTP 200 OK com o JSON gerado em memória
        return ResponseEntity.ok(draftedTeams);
    }
}