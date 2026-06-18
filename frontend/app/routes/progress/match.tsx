import { useEffect } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/match";
import { BackButton, ProgressScreen } from "~/components/progress/shell";
import { MinusIcon, PlusIcon } from "~/components/progress/icons";
import { formatDuration, useProgressData } from "~/components/progress/store";
import { VsDivider } from "~/components/progress/teams";
import {
  progressLinkMuted,
  progressScore,
  progressScoreControl,
  progressScoreIcon,
  progressTeamTitle,
  progressTimer,
} from "~/components/progress/tokens";

function ScoreColumn({
  label,
  score,
  onIncrement,
  onDecrement,
}: {
  label: string;
  score: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4 sm:gap-3 sm:py-6 md:gap-4 md:py-8 lg:gap-5 lg:py-10">
      <div className={`text-center ${progressTeamTitle}`}>{label}</div>
      <button
        type="button"
        onClick={onIncrement}
        className={progressScoreControl}
        aria-label={`Ponto ${label}`}
      >
        <PlusIcon className={progressScoreIcon} />
      </button>
      <span className={progressScore}>{score}</span>
      <button
        type="button"
        onClick={onDecrement}
        className={`${progressScoreControl} disabled:cursor-default disabled:opacity-30`}
        aria-label={`Remover ponto ${label}`}
        disabled={score <= 0}
      >
        <MinusIcon className={progressScoreIcon} />
      </button>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Placar — Vôlei Preá" }];
}

export default function MatchScore() {
  const { currentMatch, tickMatch, updateScore } = useProgressData();

  useEffect(() => {
    if (!currentMatch) return;
    const id = setInterval(tickMatch, 1000);
    return () => clearInterval(id);
  }, [currentMatch, tickMatch]);

  if (!currentMatch) {
    return (
      <ProgressScreen>
        <BackButton to="/progress/new" />
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
          <p className={progressTeamTitle}>Nenhuma partida em andamento</p>
          <Link to="/progress/new" className={progressLinkMuted}>
            Criar nova partida
          </Link>
        </div>
      </ProgressScreen>
    );
  }

  return (
    <ProgressScreen>
      <BackButton to="/progress/new" />
      <div
        className={`absolute top-3 left-1/2 z-20 -translate-x-1/2 sm:top-4 md:top-6 ${progressTimer}`}
        aria-live="polite"
        aria-label="Tempo de partida"
      >
        {formatDuration(currentMatch.elapsedSeconds)}
      </div>
      <Link
        to="/progress/match/end"
        className={`absolute top-3 right-3 z-20 cursor-pointer sm:top-4 sm:right-4 md:top-6 md:right-6 ${progressLinkMuted}`}
      >
        Encerrar
      </Link>
      <div className="flex min-h-0 flex-1 flex-col items-stretch pt-10 sm:flex-row sm:pt-12 md:pt-14">
        <ScoreColumn
          label={currentMatch.team1.name}
          score={currentMatch.score1}
          onIncrement={() => updateScore("team1", 1)}
          onDecrement={() => updateScore("team1", -1)}
        />
        <VsDivider />
        <ScoreColumn
          label={currentMatch.team2.name}
          score={currentMatch.score2}
          onIncrement={() => updateScore("team2", 1)}
          onDecrement={() => updateScore("team2", -1)}
        />
      </div>
    </ProgressScreen>
  );
}
