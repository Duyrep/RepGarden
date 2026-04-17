import { Ripple } from "react-ripple-click";
import { twMerge } from "tailwind-merge";

export default function Button({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={twMerge(
        "relative overflow-hidden isolate bg-primary text-on-primary font-bold rounded-md p-1.5 cursor-pointer duration-200 hover:bg-primary-a10",
        className,
      )}
      {...props}
    >
      <Ripple />
      {children}
    </button>
  );
}
