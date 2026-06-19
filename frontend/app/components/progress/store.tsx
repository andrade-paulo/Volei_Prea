import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  STORAGE_KEYS,
  TEAM_SIZE,
  buildPlayerHistory,
  clampScore,
  getWinRateFromRecord,
  makeId,
  normalizePlayers,
  readStorage,
  seedPlayers,
  shuffle,
  splitPlayers,
  writeStorage,
} from "./model";
import type {
  CurrentMatch,
  MatchHistoryItem,
  MatchMode,
  Player,
  PlayerHistoryItem,
  TeamDraft,
} from "./model";

export type {
  CurrentMatch,
  MatchHistoryItem,
  MatchMode,
  Player,
  PlayerHistoryItem,
  TeamDraft,
} from "./model";

type ProgressData = {
  players: Player[];
  currentMatch: CurrentMatch | null;
  lastFinishedMatch: MatchHistoryItem | null;
  matches: MatchHistoryItem[];
  playerHistory: PlayerHistoryItem[];
  getPlayerName: (playerId: string) => string;
  addPlayer: (name: string, pin: string) => Player | null;
  updatePlayer: (playerId: string, patch: Pick<Player, "name" | "pin">) => void;
  deletePlayer: (playerId: string) => void;
  makeManualTeams: () => [TeamDraft, TeamDraft];
  makeRandomTeams: (selectedPlayerIds?: string[]) => [TeamDraft, TeamDraft];
  makeBalancedTeams: (selectedPlayerIds?: string[]) => [TeamDraft, TeamDraft];
  startMatch: (mode: MatchMode, team1: TeamDraft, team2: TeamDraft) => void;
  updateScore: (side: "team1" | "team2", delta: 1 | -1) => void;
  tickMatch: () => void;
  finishMatch: () => MatchHistoryItem | null;
  deleteMatch: (matchId: string) => void;
};

const ProgressDataContext = createContext<ProgressData | null>(null);

export function ProgressDataProvider({ children }: { children: ReactNode }) {
  // Persistência local do protótipo: jogadores e partidas são restaurados do navegador.
  const [players, setPlayers] = useState<Player[]>(() =>
    normalizePlayers(readStorage(STORAGE_KEYS.players, seedPlayers)),
  );
  const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(() =>
    readStorage(STORAGE_KEYS.currentMatch, null),
  );
  const [lastFinishedMatch, setLastFinishedMatch] = useState<MatchHistoryItem | null>(() =>
    readStorage(STORAGE_KEYS.lastFinishedMatch, null),
  );
  const [matches, setMatches] = useState<MatchHistoryItem[]>(() => readStorage(STORAGE_KEYS.matches, []));

  useEffect(() => {
    writeStorage(STORAGE_KEYS.players, players);
  }, [players]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.currentMatch, currentMatch);
  }, [currentMatch]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.lastFinishedMatch, lastFinishedMatch);
  }, [lastFinishedMatch]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.matches, matches);
  }, [matches]);

  const playerHistory = useMemo(() => buildPlayerHistory(players), [players]);
  const playerById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);

  const value = useMemo<ProgressData>(() => {
    function getPlayerName(playerId: string) {
      return playerById.get(playerId)?.name ?? "Jogador removido";
    }

    function addPlayer(name: string, pin: string) {
      const trimmed = name.trim();
      const trimmedPin = pin.trim();
      const existing = players.find((player) => player.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) return existing;
      if (!trimmed || !trimmedPin) return null;

      const player: Player = {
        id: makeId("player"),
        name: trimmed,
        pin: trimmedPin,
        wins: 0,
        losses: 0,
        createdAt: new Date().toISOString(),
        startsInDraft: false,
      };
      setPlayers((current) => [...current, player]);
      return player;
    }

    function updatePlayer(playerId: string, patch: Pick<Player, "name" | "pin">) {
      const nextName = patch.name.trim();
      const nextPin = patch.pin.trim();
      if (!nextName || !nextPin) return;

      setPlayers((current) => {
        const duplicateName = current.some(
          (player) => player.id !== playerId && player.name.toLowerCase() === nextName.toLowerCase(),
        );
        if (duplicateName) return current;

        return current.map((player) =>
          player.id === playerId
            ? { ...player, name: nextName, pin: nextPin }
            : player,
        );
      });
    }

    function deletePlayer(playerId: string) {
      setPlayers((current) => current.filter((player) => player.id !== playerId));
      setCurrentMatch((match) =>
        match
          ? {
              ...match,
              team1: { ...match.team1, playerIds: match.team1.playerIds.filter((id) => id !== playerId) },
              team2: { ...match.team2, playerIds: match.team2.playerIds.filter((id) => id !== playerId) },
            }
          : match,
      );
    }

    function makeManualTeams() {
      const allPlayerIds = players
        .filter((player) => player.startsInDraft)
        .map((player) => player.id);
      const middle = Math.ceil(allPlayerIds.length / 2);
      return [
        { name: "Time 1", playerIds: allPlayerIds.slice(0, middle) },
        { name: "Time 2", playerIds: allPlayerIds.slice(middle) },
      ] satisfies [TeamDraft, TeamDraft];
    }

    function makeRandomTeams(selectedPlayerIds?: string[]) {
      const pool = selectedPlayerIds?.length
        ? players.filter((player) => selectedPlayerIds.includes(player.id))
        : players;
      return splitPlayers(shuffle(pool.map((player) => player.id)).slice(0, TEAM_SIZE * 2));
    }

    function makeBalancedTeams(selectedPlayerIds?: string[]) {
      const pool = selectedPlayerIds?.length
        ? players.filter((player) => selectedPlayerIds.includes(player.id))
        : players;
      const sorted = [...pool]
        .sort(
          (a, b) =>
            getWinRateFromRecord(b.wins, b.losses) - getWinRateFromRecord(a.wins, a.losses) ||
            a.name.localeCompare(b.name),
        )
        .slice(0, TEAM_SIZE * 2);
      const team1: string[] = [];
      const team2: string[] = [];
      let total1 = 0;
      let total2 = 0;

      for (const player of sorted) {
        const playerRate = getWinRateFromRecord(player.wins, player.losses);
        if (total1 <= total2) {
          team1.push(player.id);
          total1 += playerRate;
        } else {
          team2.push(player.id);
          total2 += playerRate;
        }
      }

      return [
        { name: "Time 1", playerIds: team1 },
        { name: "Time 2", playerIds: team2 },
      ] satisfies [TeamDraft, TeamDraft];
    }

    function startMatch(mode: MatchMode, team1: TeamDraft, team2: TeamDraft) {
      setLastFinishedMatch(null);
      setCurrentMatch({
        id: makeId("match"),
        mode,
        team1: { name: team1.name, playerIds: [...team1.playerIds] },
        team2: { name: team2.name, playerIds: [...team2.playerIds] },
        score1: 0,
        score2: 0,
        startedAt: new Date().toISOString(),
        elapsedSeconds: 0,
      });
    }

    function updateScore(side: "team1" | "team2", delta: 1 | -1) {
      setCurrentMatch((match) => {
        if (!match) return match;
        return side === "team1"
          ? { ...match, score1: clampScore(match.score1 + delta) }
          : { ...match, score2: clampScore(match.score2 + delta) };
      });
    }

    function tickMatch() {
      setCurrentMatch((match) => (match ? { ...match, elapsedSeconds: match.elapsedSeconds + 1 } : match));
    }

    function finishMatch() {
      if (!currentMatch) return null;

      if (currentMatch.score1 === currentMatch.score2) return null;

      const team1Won = currentMatch.score1 > currentMatch.score2;
      const winnerTeamName = team1Won ? currentMatch.team1.name : currentMatch.team2.name;
      const finished: MatchHistoryItem = {
        id: currentMatch.id,
        mode: currentMatch.mode,
        team1: currentMatch.team1,
        team2: currentMatch.team2,
        score1: currentMatch.score1,
        score2: currentMatch.score2,
        winnerTeamName,
        durationSeconds: currentMatch.elapsedSeconds,
        finishedAt: new Date().toISOString(),
      };

      setMatches((current) => [finished, ...current.filter((match) => match.id !== finished.id)]);
      setPlayers((current) =>
        current.map((player) => {
          if (currentMatch.team1.playerIds.includes(player.id)) {
            return {
              ...player,
              wins: player.wins + (team1Won ? 1 : 0),
              losses: player.losses + (team1Won ? 0 : 1),
            };
          }

          if (currentMatch.team2.playerIds.includes(player.id)) {
            return {
              ...player,
              wins: player.wins + (team1Won ? 0 : 1),
              losses: player.losses + (team1Won ? 1 : 0),
            };
          }

          return player;
        }),
      );
      setLastFinishedMatch(finished);
      setCurrentMatch(null);
      return finished;
    }

    function deleteMatch(matchId: string) {
      const matchToDelete = matches.find((match) => match.id === matchId);
      if (!matchToDelete) return;

      const team1Won = matchToDelete.score1 > matchToDelete.score2;
      setMatches((current) => current.filter((match) => match.id !== matchId));
      setPlayers((current) =>
        current.map((player) => {
          if (matchToDelete.team1.playerIds.includes(player.id)) {
            return {
              ...player,
              wins: Math.max(0, player.wins - (team1Won ? 1 : 0)),
              losses: Math.max(0, player.losses - (team1Won ? 0 : 1)),
            };
          }

          if (matchToDelete.team2.playerIds.includes(player.id)) {
            return {
              ...player,
              wins: Math.max(0, player.wins - (team1Won ? 0 : 1)),
              losses: Math.max(0, player.losses - (team1Won ? 1 : 0)),
            };
          }

          return player;
        }),
      );
      setLastFinishedMatch((match) => (match?.id === matchId ? null : match));
    }

    return {
      players,
      currentMatch,
      lastFinishedMatch,
      matches,
      playerHistory,
      getPlayerName,
      addPlayer,
      updatePlayer,
      deletePlayer,
      makeManualTeams,
      makeRandomTeams,
      makeBalancedTeams,
      startMatch,
      updateScore,
      tickMatch,
      finishMatch,
      deleteMatch,
    };
  }, [currentMatch, lastFinishedMatch, matches, playerById, playerHistory, players]);

  return <ProgressDataContext.Provider value={value}>{children}</ProgressDataContext.Provider>;
}

export function useProgressData() {
  const value = useContext(ProgressDataContext);
  if (!value) throw new Error("useProgressData must be used inside ProgressDataProvider");
  return value;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  if (rest === 0) return `${minutes}min`;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}
