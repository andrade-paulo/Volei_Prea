import type { Route } from "./+types/history";
import { formatDuration, useProgressData } from "~/components/progress/store";
import { HistoryTabs } from "~/components/progress/history-tabs";
import { ProgressScreen } from "~/components/progress/shell";
import { IconImg, progressIcons } from "~/components/progress/icons";
import {
  historyDataCell,
  historyHeaderCell,
  historyMatchesActionsCell,
  historyMatchesDataStrip,
  historyNameCell,
  historyTableRow,
  matchesTable,
} from "~/components/progress/history-table";
import { progressIconAction, progressTableText } from "~/components/progress/tokens";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Histórico — Partidas" }];
}

export default function HistoryMatches() {
  const { matches, deleteMatch } = useProgressData();

  return (
    <ProgressScreen className="pb-6 sm:pb-8">
      <HistoryTabs active="matches" />
      <div className="flex min-h-0 flex-1 flex-col px-3 sm:px-4 md:px-6 lg:px-8">
        <div className={`mt-4 pb-8 sm:mt-6 ${matchesTable} ${progressTableText}`}>
          <div className={`${historyTableRow} font-bold uppercase`}>
            <span className={historyHeaderCell}>Time 1</span>
            <span className={historyHeaderCell}>Time 2</span>
            <span className={historyHeaderCell}>Placar</span>
            <span className={historyHeaderCell}>
              <span className="hidden sm:inline">Duração</span>
              <span className="sm:hidden">Dur.</span>
            </span>
            <span className={historyHeaderCell}>Ações</span>
          </div>

          {matches.map((match) => (
            <div key={match.id} className={historyTableRow}>
              <div className={historyMatchesDataStrip}>
                <span className={historyNameCell}>{match.team1.name}</span>
                <span className={historyNameCell}>{match.team2.name}</span>
                <span className={historyDataCell}>
                  {match.score1} x {match.score2}
                </span>
                <span className={historyDataCell}>{formatDuration(match.durationSeconds)}</span>
              </div>
              <div className={historyMatchesActionsCell}>
                <button
                  type="button"
                  onClick={() => deleteMatch(match.id)}
                  className="flex size-7 cursor-pointer items-center justify-center sm:size-8 md:size-9"
                  aria-label="Excluir partida"
                >
                  <IconImg file={progressIcons.trash} className={progressIconAction} alt="" />
                </button>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div
              className={`col-span-full border border-black bg-[#b0b0b0] px-3 py-4 text-center text-[#1a1a1a] ${progressTableText}`}
            >
              Nenhuma partida encerrada ainda.
            </div>
          )}
        </div>
      </div>
    </ProgressScreen>
  );
}
