import { Link } from "react-router";
import { IconImg } from "./icons";
import { BlockHeading } from "./shell";
import {
  progressDiagonalStep,
  progressHoverLine,
  progressIconMenu,
  progressMascotHover,
  progressNavGap,
  progressScreenPadding,
} from "./tokens";

type MascotAnchor = "top-left" | "bottom-right";

type DiagonalMenuItem = {
  to: string;
  icon: string;
  label: string;
};

const mascotAnchorClass: Record<MascotAnchor, string> = {
  "top-left": "top-0 left-0",
  "bottom-right": "right-0 bottom-0",
};

function diagonalShift(index: number, count: number) {
  const center = (count - 1) / 2;
  return center - index;
}

export function DiagonalMenu({ items }: { items: readonly DiagonalMenuItem[] }) {
  return (
    <div
      className={`flex h-full items-center justify-center ${progressScreenPadding}`}
    >
      <nav
        className={`flex flex-col items-start ${progressNavGap} ${progressDiagonalStep}`}
      >
        {items.map(({ to, icon, label }, index) => (
          <Link
            key={to}
            to={to}
            style={{
              transform: `translateX(calc(${diagonalShift(index, items.length)} * var(--diagonal-step)))`,
            }}
            className="group relative flex min-h-11 flex-col gap-2 rounded-xl px-3 py-2 pb-1 outline-none transition duration-200 hover:bg-white/4 focus-visible:bg-white/4 sm:min-h-12 lg:min-h-14"
          >
            <span className="flex items-center gap-3 sm:gap-4">
              <IconImg file={icon} className={progressIconMenu} alt="" />
              <BlockHeading className="text-white transition-colors duration-200 group-hover:text-[#e8e8e8] group-focus-visible:text-[#e8e8e8]">
                {label}
              </BlockHeading>
            </span>
            <span className={progressHoverLine} aria-hidden />
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SplitPageSide({
  to,
  label,
  mascot,
  mascotAnchor,
  mascotClassName = progressMascotHover,
}: {
  to: string;
  label: string;
  mascot: string;
  mascotAnchor: MascotAnchor;
  mascotClassName?: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex h-full items-center justify-center overflow-hidden outline-none transition duration-200"
    >
      <IconImg
        file={mascot}
        alt=""
        className={`pointer-events-none absolute ${mascotAnchorClass[mascotAnchor]} ${mascotClassName} opacity-0 saturate-110 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100`}
      />
      <BlockHeading
        muted
        className="relative z-10 text-center transition-colors duration-200 group-hover:text-[#e8e8e8] group-focus-visible:text-[#e8e8e8]"
      >
        {label}
      </BlockHeading>
    </Link>
  );
}
