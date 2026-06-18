import { useState } from "react";
import type { ReactNode } from "react";
import { IconImg, progressIcons } from "./icons";
import {
  progressBadge,
  progressIconAction,
  progressIconDice,
  progressTableText,
  progressTeamTitle,
} from "./tokens";

export function TeamBoard({
  leftHeader,
  leftBody,
  rightHeader,
  rightBody,
  centerTop,
}: {
  leftHeader: ReactNode;
  leftBody: ReactNode;
  rightHeader: ReactNode;
  rightBody: ReactNode;
  centerTop?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-5 sm:gap-6 md:hidden">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex justify-center">{leftHeader}</div>
          {leftBody}
        </div>
        {centerTop && <div className="flex justify-center">{centerTop}</div>}
        <VsDivider />
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex justify-center">{rightHeader}</div>
          {rightBody}
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)] md:items-stretch md:gap-x-6 lg:gap-x-10">
        <div className="flex items-center justify-center self-end pb-2 md:col-start-1 md:row-start-1">
          {leftHeader}
        </div>
        <div className="flex items-end justify-center pb-2 md:col-start-2 md:row-start-1">
          {centerTop}
        </div>
        <div className="flex items-center justify-center self-end pb-2 md:col-start-3 md:row-start-1">
          {rightHeader}
        </div>

        <div className="min-w-0 md:col-start-1 md:row-start-2">{leftBody}</div>
        <div className="flex min-h-0 justify-center self-stretch md:col-start-2 md:row-start-2">
          <VsDivider />
        </div>
        <div className="min-w-0 md:col-start-3 md:row-start-2">{rightBody}</div>
      </div>
    </>
  );
}

const dividerLineH =
  "h-px w-full bg-[#e85d2a] shadow-[0_0_10px_#e85d2a]";

const dividerLineV =
  "w-px flex-1 bg-[#e85d2a] shadow-[0_0_10px_#e85d2a] lg:shadow-[0_0_14px_#e85d2a]";

export function VsDivider() {
  return (
    <div className="flex w-full flex-col items-center md:h-full md:w-10 lg:w-12">
      <div className={`${dividerLineH} shrink-0 md:hidden`} />
      <div className={`hidden min-h-4 md:block ${dividerLineV}`} />
      <div className="relative z-10 shrink-0 py-3 md:py-4">
        <div className={progressBadge}>VS!</div>
      </div>
      <div className={`hidden min-h-4 md:block ${dividerLineV}`} />
    </div>
  );
}

export function DiceRerollButton({
  onClick,
  label = "Sortear novamente",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer p-1 hover:opacity-80"
      aria-label={label}
    >
      <IconImg file={progressIcons.dice} className={progressIconDice} alt="" />
    </button>
  );
}

type TeamPlayerRow = string | { id: string; name: string };

function playerRowId(player: TeamPlayerRow) {
  return typeof player === "string" ? player : player.id;
}

function playerRowName(player: TeamPlayerRow) {
  return typeof player === "string" ? player : player.name;
}

export function TeamHeader({
  title,
  editableTitle = false,
  onTitleChange,
}: {
  title: string;
  editableTitle?: boolean;
  onTitleChange?: (name: string) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  function commitTitle() {
    const next = draftTitle.trim() || title;
    onTitleChange?.(next);
    setDraftTitle(next);
    setEditingTitle(false);
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${progressTeamTitle}`}>
      {editingTitle ? (
        <input
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitTitle();
            if (e.key === "Escape") {
              setDraftTitle(title);
              setEditingTitle(false);
            }
          }}
          autoFocus
          className={`max-w-[10rem] border-b border-[#e85d2a] bg-transparent text-center uppercase outline-none sm:max-w-[12rem] ${progressTeamTitle}`}
        />
      ) : (
        <span>{title}</span>
      )}
      {editableTitle && !editingTitle && (
        <button
          type="button"
          className="cursor-pointer p-1 hover:opacity-80"
          aria-label={`Editar nome de ${title}`}
          onClick={() => {
            setDraftTitle(title);
            setEditingTitle(true);
          }}
        >
          <IconImg file={progressIcons.edit} className={progressIconAction} alt="" />
        </button>
      )}
    </div>
  );
}

export function TeamRoster({
  players,
  removable = false,
  onRemovePlayer,
  onAdd,
}: {
  players: readonly TeamPlayerRow[];
  removable?: boolean;
  onRemovePlayer?: (playerId: string) => void;
  onAdd?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1.5 sm:gap-2">
      {players.map((player) => {
        const id = playerRowId(player);
        const name = playerRowName(player);

        return (
          <li
            key={id}
            className={`font-display flex items-center justify-between border border-[#e8e8e8]/80 bg-transparent px-2 py-2 text-[#e8e8e8] sm:px-2 sm:py-3 md:px-3 ${progressTableText}`}
          >
            <span className="truncate">{name}</span>
            {removable && (
              <button
                type="button"
                className="ml-2 shrink-0 cursor-pointer p-0.5"
                aria-label={`Remover ${name}`}
                onClick={() => onRemovePlayer?.(id)}
              >
                <IconImg
                  file={progressIcons.trash}
                  className={`${progressIconAction} brightness-0 invert`}
                  alt=""
                />
              </button>
            )}
          </li>
        );
      })}
      {onAdd && (
        <li>
          <button
            type="button"
            onClick={onAdd}
            className={`w-full cursor-pointer border border-dashed border-[#e8e8e8]/50 px-2 py-2 text-left text-[#e8e8e8]/80 sm:px-2 sm:py-3 md:px-3 ${progressTableText}`}
          >
            +Adicionar...
          </button>
        </li>
      )}
    </ul>
  );
}
