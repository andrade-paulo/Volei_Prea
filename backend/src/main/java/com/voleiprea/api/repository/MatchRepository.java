package com.voleiprea.api.repository;

import com.voleiprea.api.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
}