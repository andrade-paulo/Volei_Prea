import { useState } from "react";
import type { Route } from "./+types/history.players";
import { type Player, useProgressData } from "~/components/progress/store";
import { HistoryTabs } from "~/components/progress/history-tabs";
import { ProgressScreen } from "~/components/progress/shell";
import { IconImg, progressIcons } from "~/components/progress/icons";
import {
  historyDataCell,
  historyHeaderCell,
  historyNameCell,
  historyPlayersActionsCell,
  historyPlayersDataStrip,
  historyTableRow,
  playersTable,
} from "~/components/progress/history-table";
import { ScrollHint } from "~/components/progress/scroll-hint";
import {
  progressBody,
  progressIconAction,
  progressLabel,
  progressTableText,
} from "~/components/progress/tokens";

function maskPin(pin: string) {
  return "*".repeat(pin.length);
}

function EditPlayerDialog({
  player,
  existingNames,
  onClose,
  onSave,
}: {
  player: Player;
  existingNames: Set<string>;
  onClose: () => void;
  onSave: (patch: Pick<Player, "name" | "pin">) => void;
}) {
  const [name, setName] = useState(player.name);
  const [pin, setPin] = useState(player.pin);

  const trimmedName = name.trim();
  const trimmedPin = pin.trim();
  const duplicateName = trimmedName.toLowerCase() !== player.name.toLowerCase() && existingNames.has(trimmedName.toLowerCase());
  const validationMessage = !trimmedName
    ? "Informe o nome do jogador."
    : !trimmedPin
      ? "Informe o PIN do jogador."
      : duplicateName
        ? "Já existe outro jogador com esse nome."
        : null;

  function save() {
    if (validationMessage) return;
    onSave({ name: trimmedName, pin: trimmedPin });
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-[#e85d2a] bg-[#4a4a4a] p-4 text-[#e8e8e8] shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className={`uppercase ${progressLabel}`}>Editar jogador</h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none" aria-label="Fechar">
            ×
          </button>
        </div>

        <label className={`flex flex-col gap-1 ${progressBody}`}>
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-md bg-[#b0b0b0] px-3 py-2 text-black outline-none"
          />
        </label>

        <label className={`flex flex-col gap-1 ${progressBody}`}>
          PIN
          <input
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="rounded-md bg-[#b0b0b0] px-3 py-2 text-black outline-none"
          />
        </label>

        {validationMessage && <p className="text-sm text-orange-200">{validationMessage}</p>}

        <button
          type="button"
          onClick={save}
          className={`rounded-lg bg-[#e85d2a] px-4 py-2 uppercase ${progressLabel}`}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Histórico — Jogadores" }];
}

export default function HistoryPlayers() {
  const { playerHistory, updatePlayer, deletePlayer } = useProgressData();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const existingNames = new Set(playerHistory.map((player) => player.name.toLowerCase()));

  function handleDeletePlayer(player: Player) {
    const confirmed = window.confirm(`Excluir o jogador ${player.name}? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;
    deletePlayer(player.id);
  }

  return (
    <ProgressScreen className="pb-6 sm:pb-8">
      <HistoryTabs active="players" />
      <div className="flex min-h-0 flex-1 flex-col px-3 sm:px-4 md:px-6 lg:px-8">
        <ScrollHint className="mt-4 sm:mt-6">
          <div className={`pb-8 ${playersTable} ${progressTableText}`}>
            <div className={`${historyTableRow} font-bold uppercase`}>
              <span className={historyHeaderCell}>Nome</span>
              <span className={historyHeaderCell}>PIN</span>
              <span className={historyHeaderCell}>Partidas</span>
              <span className={historyHeaderCell}>Vitórias</span>
              <span className={historyHeaderCell}>Derrotas</span>
              <span className={historyHeaderCell}>%</span>
              <span className={historyHeaderCell}>Ações</span>
            </div>

            {playerHistory.map((player) => (
              <div key={player.id} className={historyTableRow}>
                <div className={historyPlayersDataStrip}>
                  <span className={historyNameCell}>{player.name}</span>
                  <span className={historyDataCell}>{maskPin(player.pin)}</span>
                  <span className={historyDataCell}>{player.matches}</span>
                  <span className={historyDataCell}>{player.wins}</span>
                  <span className={historyDataCell}>{player.losses}</span>
                  <span className={historyDataCell}>{player.winRate}%</span>
                </div>
                <div className={historyPlayersActionsCell}>
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(player)}
                    className="flex size-7 cursor-pointer items-center justify-center sm:size-8 md:size-9"
                    aria-label={`Editar ${player.name}`}
                  >
                    <IconImg file={progressIcons.edit} className={progressIconAction} alt="" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlayer(player)}
                    className="flex size-7 cursor-pointer items-center justify-center sm:size-8 md:size-9"
                    aria-label={`Excluir ${player.name}`}
                  >
                    <IconImg file={progressIcons.trash} className={progressIconAction} alt="" />
                  </button>
                </div>
              </div>
            ))}

            {playerHistory.length === 0 && (
              <div
                className={`col-span-full border border-black bg-[#b0b0b0] px-3 py-4 text-center text-[#1a1a1a] ${progressTableText}`}
              >
                Nenhum jogador cadastrado.
              </div>
            )}
          </div>
        </ScrollHint>
      </div>

      {editingPlayer && (
        <EditPlayerDialog
          player={editingPlayer}
          existingNames={existingNames}
          onClose={() => setEditingPlayer(null)}
          onSave={(patch) => {
            updatePlayer(editingPlayer.id, patch);
            setEditingPlayer(null);
          }}
        />
      )}
    </ProgressScreen>
  );
}
