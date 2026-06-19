import type { Route } from "./+types/new";
import {
  BackButton,
  DiagonalLine,
  ProgressScreen,
} from "~/components/progress/shell";
import { IconImg, progressIcons } from "~/components/progress/icons";
import { DiagonalMenu } from "~/components/progress/split-page";
import { progressMascotHero } from "~/components/progress/tokens";

const MODES = [
  {
    to: "/progress/new/random",
    icon: progressIcons.dice,
    label: "Aleatório",
  },
  {
    to: "/progress/new/balanced",
    icon: progressIcons.scaleBalanced,
    label: "Times Balanceados",
  },
  {
    to: "/progress/new/manual",
    icon: progressIcons.hand,
    label: "Seleção manual",
  },
  {
    to: "/progress/new/add-player",
    icon: progressIcons.user,
    label: "+Novo jogador",
  },
] as const;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Novo jogo — Vôlei Preá" }];
}

export default function NewGameMode() {
  return (
    <ProgressScreen>
      <BackButton to="/progress" />
      <DiagonalLine />
      <div className="relative z-10 grid h-full min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden h-full items-center justify-center overflow-hidden lg:flex">
          <IconImg
            file={progressIcons.mascotNovoJogo}
            alt=""
            className={progressMascotHero}
          />
        </div>
        <DiagonalMenu items={MODES} />
      </div>
    </ProgressScreen>
  );
}
