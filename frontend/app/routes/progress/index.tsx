import type { Route } from "./+types/index";
import { DiagonalLine, ProgressScreen } from "~/components/progress/shell";
import { progressIcons } from "~/components/progress/icons";
import { SplitPageSide } from "~/components/progress/split-page";
import {
  progressMascotHistorico,
  progressMascotHover,
} from "~/components/progress/tokens";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Vôlei Preá" }];
}

export default function ProgressHome() {
  return (
    <ProgressScreen>
      <DiagonalLine />
      <div className="relative z-10 grid h-full min-h-0 flex-1 grid-cols-1 sm:grid-cols-2">
        <SplitPageSide
          to="/progress/new"
          label="Novo jogo"
          mascot={progressIcons.mascotNovoJogo}
          mascotAnchor="top-left"
          mascotClassName={progressMascotHover}
        />
        <SplitPageSide
          to="/progress/history"
          label="Histórico"
          mascot={progressIcons.mascotHistorico}
          mascotAnchor="bottom-right"
          mascotClassName={progressMascotHistorico}
        />
      </div>
    </ProgressScreen>
  );
}
