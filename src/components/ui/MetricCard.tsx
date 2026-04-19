import type React from "react";
import { twMerge } from "tailwind-merge";

export type MetricValueType = "temperature" | "percentage" | "days" | "raw";

export type MetricColor =
  | "red"
  | "cyan"
  | "green"
  | "blue"
  | "yellow"
  | "orange";

export interface MetricCardProps {
  title: string;
  value: string | number;
  valueType?: MetricValueType;
  icon: React.ReactNode;
  color?: MetricColor;
  className?: string;
}

const themeClasses: Record<
  MetricColor,
  { border: string; bg: string; text: string }
> = {
  red: { border: "border-red-500", bg: "bg-red-200", text: "text-red-800" },
  cyan: { border: "border-cyan-500", bg: "bg-cyan-200", text: "text-cyan-800" },
  green: {
    border: "border-green-500",
    bg: "bg-green-200",
    text: "text-green-800",
  },
  blue: { border: "border-blue-500", bg: "bg-blue-200", text: "text-blue-800" },
  yellow: {
    border: "border-yellow-500",
    bg: "bg-yellow-200",
    text: "text-yellow-800",
  },
  orange: {
    border: "border-orange-500",
    bg: "bg-orange-200",
    text: "text-orange-800",
  },
};

// Hàm hỗ trợ tự động format giá trị
const formatValue = (val: string | number, type: MetricValueType) => {
  switch (type) {
    case "temperature":
      return `${val}℃`;
    case "percentage":
      return `${val}%`;
    case "days":
      return `${val} ngày`;
    case "raw":
    default:
      return val;
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  valueType = "raw",
  icon,
  color = "blue",
  className = "",
}) => {
  const theme = themeClasses[color] || themeClasses.blue;

  const displayValue = formatValue(value, valueType);

  return (
    <div
      className={twMerge(
        "flex-none whitespace-nowrap select-none flex gap-3 p-3 shadow bg-surface-a0 rounded-md border-l-4 hover:shadow-lg duration-200 text-on-surface w-full",
        theme.border,
        className,
      )}
    >
      <div
        className={`flex justify-center items-center p-2 rounded-md aspect-square ${theme.bg} ${theme.text}`}
      >
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm text-gray-600">{title}</p>
        <b className="text-lg">{displayValue}</b>
      </div>
    </div>
  );
};
