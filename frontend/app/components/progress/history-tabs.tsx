import { NavLink } from "react-router";
import { BackButton } from "./shell";
import { progressTitle } from "./tokens";

export function HistoryTabs({ active }: { active: "matches" | "players" }) {
  const tabClass = (isActive: boolean) =>
    `${progressTitle} ${isActive ? "text-white" : "text-[#666]"}`;

  return (
    <>
      <BackButton to="/progress" />
      <nav className="mt-12 flex items-center justify-center gap-3 px-3 sm:mt-14 sm:gap-4 sm:px-4 md:mt-16 md:gap-6 lg:mt-20 xl:gap-8">
        <NavLink to="/progress/history" end className={tabClass(active === "matches")}>
          Partidas
        </NavLink>
        <span className="h-6 w-px bg-white/40 sm:h-8 md:h-10 lg:h-12" aria-hidden />
        <NavLink
          to="/progress/history/players"
          className={tabClass(active === "players")}
        >
          Jogadores
        </NavLink>
      </nav>
    </>
  );
}
