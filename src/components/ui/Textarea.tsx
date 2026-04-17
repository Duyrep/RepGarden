import { twMerge } from "tailwind-merge";

export default function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={twMerge(
        "px-2 py-1 outline border border-surface-a40 rounded-md bg-surface-a0 duration-200",
        "hover:border-primary outline outline-transparent focus-within:outline-primary focus-within:outline-2 focus-within:hover:border-transparent focus-within:border-transparent",
        className,
      )}
    />
  );
}
