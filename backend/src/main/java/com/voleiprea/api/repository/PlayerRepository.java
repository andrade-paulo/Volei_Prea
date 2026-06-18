package com.voleiprea.api.repository;

import com.voleiprea.api.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {
    // Consultas derivadas (Derived Queries) para resgatar os níveis no algoritmo de balanceamento entrarão aqui futuramente.
}