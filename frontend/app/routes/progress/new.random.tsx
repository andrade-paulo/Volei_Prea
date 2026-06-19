import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/new.random";
import { useProgressData } from "~/components/progress/store";
import {
  BackButton,
  BlockHeading,
  PrimaryButton,
  ProgressScreen,
  ScreenBody,
} from "~/components/progress/shell";
import {
  DiceRerollButton,
  TeamBoard,
  TeamHeader,
  TeamRoster,
} from "~/components/progress/teams";
import { progressBody } from "~/components/progress/tokens";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Times aleatórios — Vôlei Preá" }];
}

export default function RandomTeams() {
  const navigate = useNavigate();
  const { players, getPlayerName, makeRandomTeams, startMatch } = useProgressData();
  const defaultSelectedIds = useMemo(() => {
    const draftPlayers = players.filter((player) => player.startsInDraft).map((player) => player.id);
    return draftPlayers.length ? draftPlayers : players.map((player) => player.id);
  }, [players]);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [teams, setTeams] = useState(() => makeRandomTeams(defaultSelectedIds));

  function togglePlayer(playerId: string) {
    setSelectedIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  }

  function generateTeams() {
    setTeams(makeRandomTeams(selectedIds));
  }

  function beginMatch() {
    startMatch("random", teams[0], teams[1]);
    navigate("/progress/match");
  }

  const canGenerate = selectedIds.length >= 2;
  const teamsRespectSelection = [...teams[0].playerIds, ...teams[1].playerIds].every((id) => selectedIds.includes(id));
  const canStart = teamsRespectSelection && teams[0].playerIds.length > 0 && teams[1].playerIds.length > 0;
  const leftPlayers = teams[0].playerIds.map((id) => ({ id, name: getPlayerName(id) }));
  const rightPlayers = teams[1].playerIds.map((id) => ({ id, name: getPlayerName(id) }));

  return (
    <ProgressScreen>
      <BackButton to="/progress/new" />
      <ScreenBody className="mt-14 sm:mt-16">
        <section className="rounded-lg border border-white/15 bg-black/10 p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <BlockHeading className="text-white">Jogadores da partida</BlockHeading>
            <span className={`text-white/75 ${progressBody}`}>{selectedIds.length} selecionados</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {players.map((player) => {
              const selected = selectedIds.includes(player.id);
              const rate = Math.round((player.wins / Math.max(1, player.wins + player.losses)) * 100);
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => togglePlayer(player.id)}
                  className={`rounded-lg border px-3 py-3 text-left transition ${progressBody} ${selected ? "border-[#e85d2a] bg-[#e85d2a]/15 text-white" : "border-white/10 bg-white/5 text-white/80"}`}
                >
                  <div>{player.name}</div>
                  <div className="text-xs text-white/65 sm:text-sm">{player.wins}V/{player.losses}D · {rate}%</div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center">
            <PrimaryButton onClick={generateTeams} className={!canGenerate ? "pointer-events-none opacity-40" : ""}>
              Gerar times
            </PrimaryButton>
          </div>
        </section>

        <TeamBoard
          centerTop={<DiceRerollButton onClick={generateTeams} />}
          leftHeader={
            <TeamHeader
              title={teams[0].name}
              editableTitle
              onTitleChange={(name) =>
                setTeams(([left, right]) => [{ ...left, name }, right])
              }
            />
          }
          leftBody={<TeamRoster players={leftPlayers} />}
          rightHeader={
            <TeamHeader
              title={teams[1].name}
              editableTitle
              onTitleChange={(name) =>
                setTeams(([left, right]) => [left, { ...right, name }])
              }
            />
          }
          rightBody={<TeamRoster players={rightPlayers} />}
        />
        <div className="flex justify-center pt-2 sm:pt-4">
          <PrimaryButton onClick={beginMatch} className={!canStart ? "pointer-events-none opacity-40" : ""}>
            Começar!
          </PrimaryButton>
        </div>
      </ScreenBody>
    </ProgressScreen>
  );
}
