import { Ripple } from "react-ripple-click";
import { twMerge } from "tailwind-merge";

const variantStyles = {
  primary: "bg-primary text-on-primary hover:bg-primary-a10",
  secondary: "bg-surface-a0 text-on-surface text-primary hover:bg-gray-300",
  outline: "border-2 border-primary text-primary hover:bg-primary/10",
  ghost: "bg-transparent text-primary hover:bg-primary/10",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeStyles = {
  sm: "p-1 text-sm",
  md: "p-2 text-base",
  lg: "p-3 text-lg",
};

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export default function Button({
  className,
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative overflow-hidden isolate font-bold rounded-md cursor-pointer transition-colors duration-200 inline-flex items-center justify-center";

  return (
    <button
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <Ripple />
      {children}
    </button>
  );
}
