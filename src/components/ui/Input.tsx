import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function Input({
  icon,
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: {
    src: string;
    width: number;
    height: number;
  };
  label?: string;
}) {
  if (label)
    return (
      <label
        className={twMerge(
          "select-none flex items-center bg-surface-a0 border border-surface-a50 px-2 rounded-md duration-200 whitespace-nowrap hover:border-primary outline outline-transparent focus-within:outline-primary focus-within:outline-2 focus-within:hover:border-transparent focus-within:border-transparent cursor-text",
        )}
      >
        {icon && (
          <>
            <Image {...icon} alt="icon" draggable={false} />
            &nbsp;
          </>
        )}
        <p>{label}:&nbsp;</p>
        <input
          className="focus:border-primary w-full outline-none p-1"
          {...props}
        />
      </label>
    );
  else
    return (
      <input
        className={twMerge(
          "bg-surface-a0 border border-surface-a50 rounded-md px-2 py-0.5 outline-none duration-200 focus:border-primary",
          className,
        )}
        {...props}
      />
    );
}
