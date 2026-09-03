"use client";

import { cn } from "@/lib/utils";

interface DetailShellProps {
  backgroundUrl?: string | null;
  compact?: boolean;
  children: React.ReactNode;
}

export function DetailShell({
  backgroundUrl,
  compact = false,
  children,
}: DetailShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background",
        compact ? "min-h-[280px] rounded-xl" : "min-h-svh",
      )}
    >
      {backgroundUrl ? (
        <img
          src={backgroundUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div
        className={cn(
          "relative z-10",
          compact
            ? "flex min-h-[280px] items-center justify-center p-4"
            : "",
        )}
      >
        {children}
      </div>
    </div>
  );
}
