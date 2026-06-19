import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/new.add-player";
import { useProgressData } from "~/components/progress/store";
import {
  BackButton,
  PrimaryButton,
  ProgressScreen,
  ScreenBody,
  BlockHeading,
} from "~/components/progress/shell";
import { progressBody } from "~/components/progress/tokens";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Adicionar jogador — Vôlei Preá" }];
}

export default function AddPlayer() {
  const navigate = useNavigate();
  const { players, addPlayer } = useProgressData();
  const [query, setQuery] = useState("");

  const suggestions = useMemo(
    () =>
      query.trim()
        ? players.filter((player) =>
            player.name.toLowerCase().includes(query.toLowerCase()),
          )
        : [],
    [players, query],
  );

  function savePlayer() {
    const name = query.trim();
    if (!name) return;
    addPlayer(name);
    navigate("/progress/new");
  }

  return (
    <ProgressScreen>
      <BackButton to="/progress/new" />
      <ScreenBody className="mt-16 sm:mt-20">
        <BlockHeading>Adicionar jogador</BlockHeading>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full rounded-full border-none bg-[#b0b0b0] px-4 py-2.5 text-black outline-none sm:px-5 sm:py-3 lg:py-4 ${progressBody}`}
          aria-label="Buscar ou cadastrar jogador"
          placeholder="Nome do jogador"
        />
        {suggestions.length > 0 && (
          <ul className="overflow-hidden rounded-sm border border-black">
            {suggestions.map((player, i) => (
              <li key={player.id}>
                <button
                  type="button"
                  className={`w-full bg-[#6a6a6a] px-4 py-2.5 text-left uppercase hover:bg-[#777] sm:py-3 ${progressBody} ${
                    i > 0 ? "border-t border-black" : ""
                  }`}
                  onClick={() => {
                    setQuery(player.name);
                  }}
                >
                  {player.name} — {player.wins}V/{player.losses}D ({Math.round((player.wins / Math.max(1, player.wins + player.losses)) * 100)}%)
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex justify-center pt-6 sm:pt-10">
          <PrimaryButton onClick={savePlayer}>+ Novo jogador</PrimaryButton>
        </div>
      </ScreenBody>
    </ProgressScreen>
  );
}
