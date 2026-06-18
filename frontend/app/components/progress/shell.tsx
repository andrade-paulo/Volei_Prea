import { Link } from "react-router";
import type { ReactNode } from "react";
import { BackIcon } from "./icons";
import {
  progressIconAction,
  progressButton,
  progressScreenPadding,
  progressTitle,
} from "./tokens";

export function ProgressScreen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`progress-grain relative flex h-dvh w-full flex-col overflow-hidden bg-[#4a4a4a] text-[#e8e8e8] ${className}`}
    >
      {children}
    </div>
  );
}

export function ScreenBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-12 flex flex-1 flex-col gap-4 pb-6 sm:mt-14 sm:gap-5 sm:pb-8 md:mt-16 md:gap-6 lg:mt-20 lg:pb-10 ${progressScreenPadding} ${className}`}
    >
      {children}
    </div>
  );
}

export function BackButton({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="absolute top-3 left-3 z-20 flex size-10 cursor-pointer items-center justify-center sm:top-4 sm:left-4 md:top-6 md:left-6 lg:size-12"
      aria-label="Voltar"
    >
      <BackIcon className={progressIconAction} />
    </Link>
  );
}

export function DiagonalLine() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 rotate-[35deg] bg-[#e85d2a] shadow-[0_0_12px_#e85d2a] md:shadow-[0_0_16px_#e85d2a] lg:shadow-[0_0_20px_#e85d2a] xl:shadow-[0_0_24px_#e85d2a]" />
    </div>
  );
}

export function BlockHeading({
  children,
  muted = false,
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`${progressTitle} ${
        muted ? "text-[#888]" : "text-[#e8e8e8]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  to,
  onClick,
  className = "",
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
}) {
  const classes = `${progressButton} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
