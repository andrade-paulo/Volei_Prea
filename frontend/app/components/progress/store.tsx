import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type MatchMode = "manual" | "random" | "balanced";

export type Player = {
  id: string;
  name: string;
  pin: string;
  skill: 1 | 2 | 3 | 4 | 5;
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
  addPlayer: (name: string, skill?: Player["skill"]) => Player;
  updatePlayer: (playerId: string, patch: Pick<Player, "name" | "pin" | "skill">) => void;
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
  { id: "player-paulo", name: "Paulo", pin: "01", skill: 4, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-rafael-m", name: "Rafael M.", pin: "02", skill: 5, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-rafael-a", name: "Rafael A.", pin: "03", skill: 3, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-matheus", name: "Matheus", pin: "04", skill: 4, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-pablo", name: "Pablo", pin: "05", skill: 2, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-vinicius", name: "Vinicius", pin: "06", skill: 3, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-mariana", name: "Mariana", pin: "07", skill: 4, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-yan", name: "Yan", pin: "08", skill: 5, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-laura", name: "Laura", pin: "09", skill: 3, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
  { id: "player-toin", name: "Toin", pin: "10", skill: 2, createdAt: "2026-01-01T00:00:00.000Z", startsInDraft: true },
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

function buildPlayerHistory(players: Player[], matches: MatchHistoryItem[]): PlayerHistoryItem[] {
  return players.map((player) => {
    let played = 0;
    let wins = 0;

    for (const match of matches) {
      const team1HasPlayer = match.team1.playerIds.includes(player.id);
      const team2HasPlayer = match.team2.playerIds.includes(player.id);
      if (!team1HasPlayer && !team2HasPlayer) continue;

      played += 1;
      const winnerIds = match.score1 > match.score2 ? match.team1.playerIds : match.team2.playerIds;
      if (winnerIds.includes(player.id)) wins += 1;
    }

    return {
      ...player,
      matches: played,
      wins,
      losses: played - wins,
      winRate: played === 0 ? 0 : Math.round((wins / played) * 100),
    };
  });
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

function nextPin(players: Player[]) {
  const maxPin = players.reduce((max, player) => {
    const value = Number.parseInt(player.pin, 10);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return String(maxPin + 1).padStart(2, "0");
}

const ProgressDataContext = createContext<ProgressData | null>(null);

export function ProgressDataProvider({ children }: { children: ReactNode }) {
  // Enquanto não houver backend, este protótipo salva em localStorage.
  // Quando a API entrar, este carregamento inicial pode migrar para GET /players e GET /matches.
  const [players, setPlayers] = useState<Player[]>(() => readStorage(STORAGE_KEYS.players, seedPlayers));
  const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(() =>
    readStorage(STORAGE_KEYS.currentMatch, null),
  );
  const [lastFinishedMatch, setLastFinishedMatch] = useState<MatchHistoryItem | null>(() =>
    readStorage(STORAGE_KEYS.lastFinishedMatch, null),
  );
  // Depois, o histórico pode ser carregado com GET /matches e salvo com POST /matches ao encerrar partida.
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

  const playerHistory = useMemo(() => buildPlayerHistory(players, matches), [players, matches]);
  const playerById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);

  const value = useMemo<ProgressData>(() => {
    function getPlayerName(playerId: string) {
      return playerById.get(playerId)?.name ?? "Jogador removido";
    }

    function addPlayer(name: string, skill: Player["skill"] = 3) {
      // No backend, este cadastro vira um POST /players com o nome e o nível.
      // A resposta da API substituiria o objeto criado aqui pelo registro salvo no banco.
      const trimmed = name.trim();
      const existing = players.find((player) => player.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) return existing;

      const player: Player = {
        id: makeId("player"),
        name: trimmed,
        pin: nextPin(players),
        skill,
        createdAt: new Date().toISOString(),
        startsInDraft: false,
      };
      setPlayers((current) => [...current, player]);
      return player;
    }

    function updatePlayer(playerId: string, patch: Pick<Player, "name" | "pin" | "skill">) {
      // No backend, esta edição vira um PATCH /players/:id com nome, PIN e nível.
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
            ? { ...player, name: nextName, pin: nextPin, skill: patch.skill }
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
      // Balanceamento simples: jogadores de maior nível entram primeiro,
      // sempre no time que está com menor soma de níveis no momento.
      const sorted = [...players]
        .sort((a, b) => b.skill - a.skill || a.name.localeCompare(b.name))
        .slice(0, TEAM_SIZE * 2);
      const team1: string[] = [];
      const team2: string[] = [];
      let total1 = 0;
      let total2 = 0;

      for (const player of sorted) {
        if (total1 <= total2) {
          team1.push(player.id);
          total1 += player.skill;
        } else {
          team2.push(player.id);
          total2 += player.skill;
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
      // No backend, este encerramento vira um POST /matches com times, placar e duração.
      // Depois disso, o histórico pode ser recarregado com um GET /matches.
      if (!currentMatch) return null;

      if (currentMatch.score1 === currentMatch.score2) return null;

      const winnerTeamName = currentMatch.score1 > currentMatch.score2 ? currentMatch.team1.name : currentMatch.team2.name;
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
      setLastFinishedMatch(finished);
      setCurrentMatch(null);
      return finished;
    }

    function deleteMatch(matchId: string) {
      setMatches((current) => current.filter((match) => match.id !== matchId));
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
