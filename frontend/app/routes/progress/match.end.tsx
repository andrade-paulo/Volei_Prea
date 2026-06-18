import { useEffect, useState } from "react";
import type { Route } from "./+types/match.end";
import {
  BackButton,
  PrimaryButton,
  ProgressScreen,
  ScreenBody,
} from "~/components/progress/shell";
import {
  formatDuration,
  type MatchHistoryItem,
  useProgressData,
} from "~/components/progress/store";
import {
  progressCaption,
  progressLabel,
  progressScore,
  progressTitle,
} from "~/components/progress/tokens";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Fim de partida — Vôlei Preá" }];
}

export default function MatchEnd() {
  const { currentMatch, finishMatch, lastFinishedMatch } = useProgressData();
  const [summary, setSummary] = useState<MatchHistoryItem | null>(lastFinishedMatch);

  useEffect(() => {
    if (summary) return;
    const finished = finishMatch();
    if (finished) setSummary(finished);
  }, [finishMatch, summary]);

  if (!summary) {
    const tiedMatch = currentMatch && currentMatch.score1 === currentMatch.score2;

    return (
      <ProgressScreen>
        <BackButton to={tiedMatch ? "/progress/match" : "/progress/new"} />
        <ScreenBody className="mt-14 items-center text-center sm:mt-16 md:mt-20">
          <p className={progressTitle}>
            {tiedMatch ? "Partida empatada" : "Nenhum resumo disponível"}
          </p>
          {tiedMatch && (
            <p className={progressLabel}>Desempate antes de encerrar a partida.</p>
          )}
          <div className="mt-auto pt-4 sm:pt-6">
            <PrimaryButton to={tiedMatch ? "/progress/match" : "/progress/new"}>
              {tiedMatch ? "Voltar ao placar" : "Nova partida"}
            </PrimaryButton>
          </div>
        </ScreenBody>
      </ProgressScreen>
    );
  }

  const score = `${summary.score1} x ${summary.score2}`;

  return (
    <ProgressScreen>
      <BackButton to="/progress/history" />
      <ScreenBody className="mt-14 items-center text-center sm:mt-16 md:mt-20">
        <p className={`uppercase ${progressTitle}`}>{summary.winnerTeamName} venceu!</p>
        <p className={progressScore}>{score}</p>
        <p className={`mt-2 uppercase sm:mt-3 ${progressCaption}`}>
          Duração — {formatDuration(summary.durationSeconds)}
        </p>
        <div className="mt-auto pt-4 sm:pt-6">
          <PrimaryButton to="/progress/new">Nova partida</PrimaryButton>
        </div>
      </ScreenBody>
    </ProgressScreen>
  );
}
