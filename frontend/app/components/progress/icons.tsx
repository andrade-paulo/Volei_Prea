const base = "/assets/icons";

export const progressIcons = {
  back: "back.svg",
  dice: "dice.svg",
  edit: "edit.svg",
  fire: "fire.svg",
  hand: "hand.svg",
  mascotHistorico: "mascot-historico.svg",
  mascotNovoJogo: "mascot-novo-jogo.svg",
  scaleBalanced: "scale-balanced.svg",
  timer: "timer.svg",
  trash: "trash.svg",
  user: "user.svg",
  volleyball: "volleyball.svg",
} as const;

export type ProgressIcon = (typeof progressIcons)[keyof typeof progressIcons];

export function IconImg({
  file,
  className,
  alt = "",
}: {
  file: ProgressIcon | string;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`${base}/${encodeURIComponent(file)}`}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}

export function BackIcon({ className }: { className?: string }) {
  return <IconImg file={progressIcons.back} className={className} alt="Voltar" />;
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M11 4h2v16h-2zM4 11h16v2H4z" fill="currentColor" />
    </svg>
  );
}

export function MinusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="4" y="11" width="16" height="2" fill="currentColor" />
    </svg>
  );
}
