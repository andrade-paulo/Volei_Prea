import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/new.balanced";
import { AddPlayerDialog } from "~/components/progress/add-player-dialog";
import { useProgressData } from "~/components/progress/store";
import {
  BackButton,
  PrimaryButton,
  ProgressScreen,
  ScreenBody,
} from "~/components/progress/shell";
import {
  TeamBoard,
  TeamHeader,
  TeamRoster,
} from "~/components/progress/teams";

type TeamSide = 0 | 1;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Times balanceados — Vôlei Preá" }];
}

export default function BalancedTeams() {
  const navigate = useNavigate();
  const { players, addPlayer, getPlayerName, makeBalancedTeams, startMatch } = useProgressData();
  const [teams, setTeams] = useState(() => makeBalancedTeams());
  const [dialogSide, setDialogSide] = useState<TeamSide | null>(null);

  const usedPlayerIds = useMemo(
    () => new Set([...teams[0].playerIds, ...teams[1].playerIds]),
    [teams],
  );
  const usedPlayerNames = useMemo(
    () => new Set(players.filter((player) => usedPlayerIds.has(player.id)).map((player) => player.name.toLowerCase())),
    [players, usedPlayerIds],
  );
  const availablePlayers = useMemo(
    () => players.filter((player) => !usedPlayerIds.has(player.id)),
    [players, usedPlayerIds],
  );

  function playerRows(playerIds: string[]) {
    return playerIds.map((id) => ({ id, name: getPlayerName(id) }));
  }

  function removePlayer(side: TeamSide, playerId: string) {
    setTeams((current) => {
      const next = [...current] as typeof current;
      next[side] = {
        ...next[side],
        playerIds: next[side].playerIds.filter((id) => id !== playerId),
      };
      return next;
    });
  }

  function addPlayerToTeam(side: TeamSide, playerId: string) {
    if (usedPlayerIds.has(playerId)) return;
    setTeams((current) => {
      const next = [...current] as typeof current;
      next[side] = {
        ...next[side],
        playerIds: [...next[side].playerIds, playerId],
      };
      return next;
    });
    setDialogSide(null);
  }

  function createAndAddPlayer(side: TeamSide, name: string, pin: string) {
    const player = addPlayer(name, pin);
    if (!player) return;
    addPlayerToTeam(side, player.id);
  }

  function beginMatch() {
    startMatch("balanced", teams[0], teams[1]);
    navigate("/progress/match");
  }

  return (
    <ProgressScreen>
      <BackButton to="/progress/new" />
      <ScreenBody className="mt-14 sm:mt-16">
        <TeamBoard
          leftHeader={
            <TeamHeader
              title={teams[0].name}
              editableTitle
              onTitleChange={(name) =>
                setTeams(([left, right]) => [{ ...left, name }, right])
              }
            />
          }
          leftBody={
            <TeamRoster
              players={playerRows(teams[0].playerIds)}
              removable
              onRemovePlayer={(playerId) => removePlayer(0, playerId)}
              onAdd={() => setDialogSide(0)}
            />
          }
          rightHeader={
            <TeamHeader
              title={teams[1].name}
              editableTitle
              onTitleChange={(name) =>
                setTeams(([left, right]) => [left, { ...right, name }])
              }
            />
          }
          rightBody={
            <TeamRoster
              players={playerRows(teams[1].playerIds)}
              removable
              onRemovePlayer={(playerId) => removePlayer(1, playerId)}
              onAdd={() => setDialogSide(1)}
            />
          }
        />
        <div className="flex justify-center pt-2 sm:pt-4">
          <PrimaryButton onClick={beginMatch}>Começar!</PrimaryButton>
        </div>
      </ScreenBody>

      {dialogSide !== null && (
        <AddPlayerDialog
          teamName={teams[dialogSide].name}
          availablePlayers={availablePlayers}
          usedPlayerNames={usedPlayerNames}
          onClose={() => setDialogSide(null)}
          onAddExisting={(playerId) => addPlayerToTeam(dialogSide, playerId)}
          onCreateAndAdd={(name, pin) => createAndAddPlayer(dialogSide, name, pin)}
        />
      )}
    </ProgressScreen>
  );
}
