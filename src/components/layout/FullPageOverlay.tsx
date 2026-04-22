import type React from "react";
import { cn } from "@/utils";

export default function FullPageOverlay({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-transparent fixed z-10 w-full flex flex-col gap-1 justify-center items-center text-xl px-1 h-dvh p-4",
        className,
      )}
    >
      <b>{children}</b>
    </div>
  );
}
