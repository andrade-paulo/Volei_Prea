package com.voleiprea.api.service;

import com.voleiprea.api.dto.PlayerDraftDTO;
import com.voleiprea.api.dto.TeamDraftDTO;
import com.voleiprea.api.enums.VarianceLevel;
import com.voleiprea.api.model.Player;
import com.voleiprea.api.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TeamBalancingService {

    private final PlayerRepository playerRepository;
    private final Random random = new Random();

    public List<TeamDraftDTO> generateTeams(List<UUID> playerIds, VarianceLevel variance) {
        // Passo 1: Resgate Otimizado e Preparação
        List<Player> players = playerRepository.findAllById(playerIds);
        
        // Crítica: Prevenção contra lixo na entrada
        if (players.size() != playerIds.size()) {
            throw new IllegalArgumentException("Inconsistência: Um ou mais IDs enviados não existem no banco de dados.");
        }
        if (players.size() < 4) {
            throw new IllegalArgumentException("É necessário um mínimo de 4 jogadores para formar duas equipes.");
        }

        // Passo 2: Injeção de Ruído (Jitter)
        Map<Player, Double> tempScores = new HashMap<>();
        for (Player p : players) {
            // R = Multiplicador randômico entre -1.0 e 1.0
            double r = (random.nextDouble() * 2) - 1; 
            
            // Fórmula: S_temp = S_original + (R * F_mutacao)
            double sTemp = p.getScore() + (r * variance.getFactor());
            tempScores.put(p, sTemp);
        }

        // Passo 3: Ordenação Dinâmica
        // Ordena a lista decrescente com base no S_temp recém-calculado
        players.sort((p1, p2) -> Double.compare(tempScores.get(p2), tempScores.get(p1)));

        // Passo 4: Distribuição em Serpente (Snake Draft)
        List<PlayerDraftDTO> teamAPlayers = new ArrayList<>();
        List<PlayerDraftDTO> teamBPlayers = new ArrayList<>();
        int scoreA = 0;
        int scoreB = 0;

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);
            PlayerDraftDTO dto = new PlayerDraftDTO(p.getId(), p.getName(), p.getScore());

            // A lógica de distribuição em serpente 1D: A, B, B, A, A, B, B, A...
            if (i % 4 == 0 || i % 4 == 3) {
                teamAPlayers.add(dto);
                scoreA += p.getScore(); // Acumulamos o escore ORIGINAL para enviar ao front, não o mutado
            } else {
                teamBPlayers.add(dto);
                scoreB += p.getScore();
            }
        }

        // Retorna a estrutura limpa em memória (sem persistência)
        return List.of(
                new TeamDraftDTO("Equipe A", teamAPlayers, scoreA),
                new TeamDraftDTO("Equipe B", teamBPlayers, scoreB)
        );
    }
}