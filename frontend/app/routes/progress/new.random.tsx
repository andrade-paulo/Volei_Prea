import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/new.random";
import { useProgressData } from "~/components/progress/store";
import {
  BackButton,
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

export function meta({}: Route.MetaArgs) {
  return [{ title: "Times aleatórios — Vôlei Preá" }];
}

export default function RandomTeams() {
  const navigate = useNavigate();
  const { getPlayerName, makeRandomTeams, startMatch } = useProgressData();
  const [teams, setTeams] = useState(() => makeRandomTeams());

  function beginMatch() {
    startMatch("random", teams[0], teams[1]);
    navigate("/progress/match");
  }

  const leftPlayers = teams[0].playerIds.map((id) => ({ id, name: getPlayerName(id) }));
  const rightPlayers = teams[1].playerIds.map((id) => ({ id, name: getPlayerName(id) }));

  return (
    <ProgressScreen>
      <BackButton to="/progress/new" />
      <ScreenBody className="mt-14 sm:mt-16">
        <TeamBoard
          centerTop={<DiceRerollButton onClick={() => setTeams(makeRandomTeams())} />}
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
          <PrimaryButton onClick={beginMatch}>Começar!</PrimaryButton>
        </div>
      </ScreenBody>
    </ProgressScreen>
  );
}
