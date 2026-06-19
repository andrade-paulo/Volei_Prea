import { useEffect, useState } from "react";
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
  active = false,
  onIncrement,
  onDecrement,
}: {
  label: string;
  score: number;
  active?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div
      className={`relative flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border px-3 py-4 transition sm:gap-3 sm:py-6 md:gap-4 md:py-8 lg:gap-5 lg:py-10 ${
        active
          ? "border-[#e85d2a] bg-[#e85d2a]/18 shadow-[0_0_0_2px_rgba(232,93,42,0.18)]"
          : "border-white/8 bg-white/3"
      }`}
    >
      <button
        type="button"
        onClick={onIncrement}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Adicionar ponto para ${label}`}
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className={`text-center ${progressTeamTitle}`}>{label}</div>
        <button
          type="button"
          onClick={onIncrement}
          className={progressScoreControl}
          aria-label={`Ponto ${label}`}
        >
          <PlusIcon className={progressScoreIcon} />
        </button>
        <span className={`${progressScore} ${active ? "scale-105 text-white" : ""} transition`}>{score}</span>
        <button
          type="button"
          onClick={onDecrement}
          className={`${progressScoreControl} relative z-20 rounded-full bg-black/12 disabled:cursor-default disabled:opacity-30`}
          aria-label={`Desfazer ponto ${label}`}
          disabled={score <= 0}
        >
          <MinusIcon className={progressScoreIcon} />
        </button>
        <span className="font-display text-xs uppercase text-white/65 sm:text-sm">
          Toque na área para pontuar
        </span>
      </div>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Placar — Vôlei Preá" }];
}

export default function MatchScore() {
  const { currentMatch, tickMatch, updateScore } = useProgressData();
  const [activeSide, setActiveSide] = useState<"team1" | "team2" | null>(null);

  function pulse(side: "team1" | "team2") {
    setActiveSide(side);
    window.clearTimeout((pulse as typeof pulse & { timer?: number }).timer);
    (pulse as typeof pulse & { timer?: number }).timer = window.setTimeout(() => {
      setActiveSide(null);
    }, 320);
  }

  function handleIncrement(side: "team1" | "team2") {
    updateScore(side, 1);
    pulse(side);
  }

  function handleDecrement(side: "team1" | "team2") {
    updateScore(side, -1);
    pulse(side);
  }

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
      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-2 px-2 pb-2 pt-10 sm:flex-row sm:gap-3 sm:px-3 sm:pt-12 md:gap-4 md:px-4 md:pt-14">
        <ScoreColumn
          label={currentMatch.team1.name}
          score={currentMatch.score1}
          active={activeSide === "team1"}
          onIncrement={() => handleIncrement("team1")}
          onDecrement={() => handleDecrement("team1")}
        />
        <VsDivider />
        <ScoreColumn
          label={currentMatch.team2.name}
          score={currentMatch.score2}
          active={activeSide === "team2"}
          onIncrement={() => handleIncrement("team2")}
          onDecrement={() => handleDecrement("team2")}
        />
      </div>
    </ProgressScreen>
  );
}
