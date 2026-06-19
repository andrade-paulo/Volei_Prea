import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type MatchMode = "manual" | "random" | "balanced";

export type Player = {
  id: string;
  name: string;
  pin: string;
  wins: number;
  losses: number;
  createdAt: string;
  startsInDraft?: boolean;
};

export type TeamDraft = {
  name: string;
  playerIds: string[];
};

export type CurrentMatch = {
  id: string;
  mode: MatchMode;
  team1: TeamDraft;
  team2: TeamDraft;
  score1: number;
  score2: number;
  startedAt: string;
  elapsedSeconds: number;
};

export type MatchHistoryItem = {
  id: string;
  mode: MatchMode;
  team1: TeamDraft;
  team2: TeamDraft;
  score1: number;
  score2: number;
  winnerTeamName: string;
  durationSeconds: number;
  finishedAt: string;
};

export type PlayerHistoryItem = Player & {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
};

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
  makeRandomTeams: () => [TeamDraft, TeamDraft];
  makeBalancedTeams: () => [TeamDraft, TeamDraft];
  startMatch: (mode: MatchMode, team1: TeamDraft, team2: TeamDraft) => void;
  updateScore: (side: "team1" | "team2", delta: 1 | -1) => void;
  tickMatch: () => void;
  finishMatch: () => MatchHistoryItem | null;
  deleteMatch: (matchId: string) => void;
};

const TEAM_SIZE = 5;
const STORAGE_KEYS = {
  players: "volei-prea.players",
  currentMatch: "volei-prea.current-match",
  lastFinishedMatch: "volei-prea.last-finished-match",
  matches: "volei-prea.matches",
} as const;

const seedPlayers: Player[] = [
  { id: "player-paulo", name: "Paulo", pin: "01", wins: 8, losses: 5, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-rafael-m", name: "Rafael M.", pin: "02", wins: 13, losses: 3, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-rafael-a", name: "Rafael A.", pin: "03", wins: 9, losses: 6, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-matheus", name: "Matheus", pin: "04", wins: 4, losses: 7, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-pablo", name: "Pablo", pin: "05", wins: 6, losses: 8, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-vinicius", name: "Vinicius", pin: "06", wins: 12, losses: 4, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-mariana", name: "Mariana", pin: "07", wins: 10, losses: 7, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-yan", name: "Yan", pin: "08", wins: 7, losses: 8, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-laura", name: "Laura", pin: "09", wins: 11, losses: 6, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-toin", name: "Toin", pin: "10", wins: 6, losses: 5, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampScore(score: number) {
  return Math.max(0, score);
}

function shuffle<T>(items: readonly T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function splitPlayers(playerIds: string[]): [TeamDraft, TeamDraft] {
  return [
    { name: "Time 1", playerIds: playerIds.slice(0, TEAM_SIZE) },
    { name: "Time 2", playerIds: playerIds.slice(TEAM_SIZE, TEAM_SIZE * 2) },
  ];
}

function getWinRateFromRecord(wins: number, losses: number) {
  const matches = wins + losses;
  return matches === 0 ? 0 : Math.round((wins / matches) * 100);
}

function buildPlayerHistory(players: Player[]): PlayerHistoryItem[] {
  return players.map((player) => ({
    ...player,
    matches: player.wins + player.losses,
    winRate: getWinRateFromRecord(player.wins, player.losses),
  }));
}

function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizePlayers(players: unknown): Player[] {
  if (!Array.isArray(players)) return seedPlayers;

  return players.map((player, index) => {
    const item = player as Partial<Player> & { skill?: number };
    const fallback = seedPlayers[index];

    return {
      id: item.id ?? fallback?.id ?? makeId("player"),
      name: item.name ?? fallback?.name ?? `Jogador ${index + 1}`,
      pin: item.pin ?? fallback?.pin ?? String(index + 1).padStart(2, "0"),
      wins: typeof item.wins === "number" ? item.wins : fallback?.wins ?? 0,
      losses: typeof item.losses === "number" ? item.losses : fallback?.losses ?? 0,
      createdAt: item.createdAt ?? fallback?.createdAt ?? new Date().toISOString(),
      startsInDraft: item.startsInDraft ?? fallback?.startsInDraft ?? false,
    } satisfies Player;
  });
}

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

    function makeRandomTeams() {
      return splitPlayers(shuffle(players.map((player) => player.id)).slice(0, TEAM_SIZE * 2));
    }

    function makeBalancedTeams() {
      const sorted = [...players]
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
