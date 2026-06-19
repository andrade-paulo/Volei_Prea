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

export const TEAM_SIZE = 5;

export const STORAGE_KEYS = {
  players: "volei-prea.players",
  currentMatch: "volei-prea.current-match",
  lastFinishedMatch: "volei-prea.last-finished-match",
  matches: "volei-prea.matches",
} as const;

export const seedPlayers: Player[] = [
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

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clampScore(score: number) {
  return Math.max(0, score);
}

export function shuffle<T>(items: readonly T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function splitPlayers(playerIds: string[]): [TeamDraft, TeamDraft] {
  return [
    { name: "Time 1", playerIds: playerIds.slice(0, TEAM_SIZE) },
    { name: "Time 2", playerIds: playerIds.slice(TEAM_SIZE, TEAM_SIZE * 2) },
  ];
}

export function getWinRateFromRecord(wins: number, losses: number) {
  const matches = wins + losses;
  return matches === 0 ? 0 : Math.round((wins / matches) * 100);
}

export function buildPlayerHistory(players: Player[]): PlayerHistoryItem[] {
  return players.map((player) => ({
    ...player,
    matches: player.wins + player.losses,
    winRate: getWinRateFromRecord(player.wins, player.losses),
  }));
}

export function normalizePlayers(players: unknown): Player[] {
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

export function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
