import { useState } from "react";
import type { Player } from "./store";
import { progressBody, progressLabel } from "./tokens";

export function AddPlayerDialog({
  teamName,
  availablePlayers,
  usedPlayerNames,
  onClose,
  onAddExisting,
  onCreateAndAdd,
}: {
  teamName: string;
  availablePlayers: Player[];
  usedPlayerNames: Set<string>;
  onClose: () => void;
  onAddExisting: (playerId: string) => void;
  onCreateAndAdd: (name: string, pin: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlayers = normalizedQuery
    ? availablePlayers.filter((player) =>
        player.name.toLowerCase().includes(normalizedQuery),
      )
    : availablePlayers;
  const nameAlreadyInMatch = Boolean(
    normalizedQuery && usedPlayerNames.has(normalizedQuery),
  );
  const nameAlreadyAvailable = availablePlayers.some(
    (player) => player.name.toLowerCase() === normalizedQuery,
  );
  const canCreate = Boolean(normalizedQuery) && Boolean(pin.trim()) && !nameAlreadyInMatch && !nameAlreadyAvailable;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-[#e85d2a] bg-[#4a4a4a] p-4 text-[#e8e8e8] shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={`uppercase ${progressLabel}`}>Adicionar em {teamName}</h2>
            <p className="text-sm text-white/70">Escolha alguém livre ou cadastre um novo jogador.</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none" aria-label="Fechar">
            ×
          </button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`w-full rounded-full bg-[#b0b0b0] px-4 py-2 text-black outline-none ${progressBody}`}
          placeholder="Buscar ou criar jogador"
          aria-label="Buscar ou criar jogador"
        />

        <div className="max-h-52 overflow-y-auto rounded-sm border border-black">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onAddExisting(player.id)}
              className={`block w-full bg-[#6a6a6a] px-3 py-2 text-left uppercase hover:bg-[#777] ${progressBody}`}
            >
              {player.name} — {player.wins}V/{player.losses}D ({Math.round((player.wins / Math.max(1, player.wins + player.losses)) * 100)}%)
            </button>
          ))}
          {filteredPlayers.length === 0 && (
            <p className={`bg-[#6a6a6a] px-3 py-2 text-white/75 ${progressBody}`}>
              Nenhum jogador livre encontrado.
            </p>
          )}
        </div>

        {nameAlreadyInMatch && (
          <p className="text-sm text-orange-200">Esse jogador já está em um dos times.</p>
        )}

        <input
          type="password"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          className={`w-full rounded-full bg-[#b0b0b0] px-4 py-2 text-black outline-none ${progressBody}`}
          placeholder="PIN do jogador"
          aria-label="PIN do jogador"
        />

        <button
          type="button"
          disabled={!canCreate}
          onClick={() => onCreateAndAdd(query, pin)}
          className={`rounded-lg bg-[#e85d2a] px-4 py-2 uppercase disabled:cursor-default disabled:opacity-40 ${progressLabel}`}
        >
          Criar e adicionar
        </button>
      </div>
    </div>
  );
}
