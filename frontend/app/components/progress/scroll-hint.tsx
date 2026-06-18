import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function ScrollHint({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollHint = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setCanScrollDown(element.scrollHeight - element.scrollTop - element.clientHeight > 8);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollHint();
    element.addEventListener("scroll", updateScrollHint, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollHint);
    resizeObserver.observe(element);
    for (const child of element.children) {
      resizeObserver.observe(child);
    }

    return () => {
      element.removeEventListener("scroll", updateScrollHint);
      resizeObserver.disconnect();
    };
  }, [updateScrollHint, children]);

  return (
    <div className={`relative min-h-0 flex-1 ${className}`}>
      <div
        ref={scrollRef}
        className="progress-scrollbar-hidden h-full overflow-y-auto overflow-x-hidden"
      >
        {children}
      </div>
      {canScrollDown && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="size-7 animate-bounce text-white/85 sm:size-8"
          >
            <path
              d="M12 16l-6-6h12l-6 6z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
