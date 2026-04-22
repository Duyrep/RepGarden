import { twMerge } from "tailwind-merge";

export default function Loading({ className }: { className?: string }) {
  return (
    <b
      className={twMerge(
        "bg-background fixed z-50 w-full h-dvh flex flex-col text-xl justify-center items-center",
        className,
      )}
    >
      Đang tải...
    </b>
  );
}
