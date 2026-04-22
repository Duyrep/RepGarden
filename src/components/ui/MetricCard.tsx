// 1. Chỉ import tĩnh (static import) những icon có trong Enum của bạn
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart,
  Battery,
  BatteryCharging,
  Bell,
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  Cloud,
  CloudRain,
  CloudSnow,
  Coins,
  Cpu,
  Database,
  DollarSign,
  Droplet,
  Eye,
  Flame,
  Footprints,
  Heart,
  HelpCircle,
  History,
  Hourglass,
  Info,
  Leaf,
  Lightbulb,
  LineChart,
  MapPin,
  Moon,
  PieChart,
  Plug,
  Power,
  Ruler,
  Server,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Star,
  Sun,
  Tag,
  Target,
  Thermometer,
  Timer,
  TreeDeciduous,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wifi,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import type React from "react";
import { twMerge } from "tailwind-merge";

export enum MetricValueType {
  temperature = "temperature",
  percentage = "percentage",
  days = "days",
  raw = "raw",
}

export enum MetricCardIcons {
  ruler = "ruler",
  thermometer = "thermometer",
  droplet = "droplet",
  sun = "sun",
  moon = "moon",
  cloud = "cloud",
  cloudRain = "cloudRain",
  cloudSnow = "cloudSnow",
  wind = "wind",
  lightning = "lightning",
  flame = "flame",
  clock = "clock",
  calendar = "calendar",
  timer = "timer",
  hourglass = "hourglass",
  history = "history",
  leaf = "leaf",
  plant = "plant",
  tree = "tree",
  bug = "bug",
  battery = "battery",
  batteryCharging = "batteryCharging",
  plug = "plug",
  lightbulb = "lightbulb",
  power = "power",
  cpu = "cpu",
  server = "server",
  wifi = "wifi",
  barChart = "barChart",
  lineChart = "lineChart",
  pieChart = "pieChart",
  trendingUp = "trendingUp",
  trendingDown = "trendingDown",
  database = "database",
  heart = "heart",
  activity = "activity",
  footprint = "footprint",
  eye = "eye",
  dollarSign = "dollarSign",
  coins = "coins",
  wallet = "wallet",
  shoppingCart = "shoppingCart",
  bag = "bag",
  tag = "tag",
  checkCircle = "checkCircle",
  xCircle = "xCircle",
  alertCircle = "alertCircle",
  alertTriangle = "alertTriangle",
  info = "info",
  user = "user",
  users = "users",
  target = "target",
  star = "star",
  mapPin = "mapPin",
  bell = "bell",
}

export enum MetricCardColor {
  white = "white",
  red = "red",
  cyan = "cyan",
  green = "green",
  blue = "blue",
  yellow = "yellow",
  orange = "orange",
}

export interface MetricCardProps {
  children?: React.ReactNode;
  name: string;
  value: string | number;
  valueType?: MetricValueType;
  iconName: MetricCardIcons;
  iconSize?: number;
  color?: MetricCardColor;
  className?: string;
}

const themeClasses: Record<
  MetricCardColor,
  { border: string; bg: string; text: string }
> = {
  white: {
    border: "border-white-500",
    bg: "bg-white-200",
    text: "text-white-800",
  },
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

// 2. Map (Ánh xạ) giá trị từ Enum sang Component thực tế của Lucide
export const MetricCardIconMap: Record<string, React.ElementType> = {
  [MetricCardIcons.ruler]: Ruler,
  [MetricCardIcons.thermometer]: Thermometer,
  [MetricCardIcons.droplet]: Droplet,
  [MetricCardIcons.sun]: Sun,
  [MetricCardIcons.moon]: Moon,
  [MetricCardIcons.cloud]: Cloud,
  [MetricCardIcons.cloudRain]: CloudRain,
  [MetricCardIcons.cloudSnow]: CloudSnow,
  [MetricCardIcons.wind]: Wind,
  [MetricCardIcons.lightning]: Zap, // Lucide dùng Zap cho sấm sét/tia chớp
  [MetricCardIcons.flame]: Flame,
  [MetricCardIcons.clock]: Clock,
  [MetricCardIcons.calendar]: Calendar,
  [MetricCardIcons.timer]: Timer,
  [MetricCardIcons.hourglass]: Hourglass,
  [MetricCardIcons.history]: History,
  [MetricCardIcons.leaf]: Leaf,
  [MetricCardIcons.plant]: Sprout, // Lucide dùng Sprout cho cây con
  [MetricCardIcons.tree]: TreeDeciduous, // Lucide dùng TreeDeciduous cho cây trưởng thành
  [MetricCardIcons.bug]: Bug,
  [MetricCardIcons.battery]: Battery,
  [MetricCardIcons.batteryCharging]: BatteryCharging,
  [MetricCardIcons.plug]: Plug,
  [MetricCardIcons.lightbulb]: Lightbulb,
  [MetricCardIcons.power]: Power,
  [MetricCardIcons.cpu]: Cpu,
  [MetricCardIcons.server]: Server,
  [MetricCardIcons.wifi]: Wifi,
  [MetricCardIcons.barChart]: BarChart,
  [MetricCardIcons.lineChart]: LineChart,
  [MetricCardIcons.pieChart]: PieChart,
  [MetricCardIcons.trendingUp]: TrendingUp,
  [MetricCardIcons.trendingDown]: TrendingDown,
  [MetricCardIcons.database]: Database,
  [MetricCardIcons.heart]: Heart,
  [MetricCardIcons.activity]: Activity,
  [MetricCardIcons.footprint]: Footprints, // Lucide dùng Footprints
  [MetricCardIcons.eye]: Eye,
  [MetricCardIcons.dollarSign]: DollarSign,
  [MetricCardIcons.coins]: Coins,
  [MetricCardIcons.wallet]: Wallet,
  [MetricCardIcons.shoppingCart]: ShoppingCart,
  [MetricCardIcons.bag]: ShoppingBag, // Lucide dùng ShoppingBag
  [MetricCardIcons.tag]: Tag,
  [MetricCardIcons.checkCircle]: CheckCircle,
  [MetricCardIcons.xCircle]: XCircle,
  [MetricCardIcons.alertCircle]: AlertCircle,
  [MetricCardIcons.alertTriangle]: AlertTriangle,
  [MetricCardIcons.info]: Info,
  [MetricCardIcons.user]: User,
  [MetricCardIcons.users]: Users,
  [MetricCardIcons.target]: Target,
  [MetricCardIcons.star]: Star,
  [MetricCardIcons.mapPin]: MapPin,
  [MetricCardIcons.bell]: Bell,
};

const formatValue = (val: string | number, type: MetricValueType) => {
  switch (type) {
    case "temperature":
      return `${val}℃`;
    case "percentage":
      return `${val}%`;
    case "days":
      return `${val} ngày`;
    case "raw":
      return val;
    default:
      return val;
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  children,
  name,
  value,
  valueType = MetricValueType.raw,
  iconName,
  iconSize = 28,
  color = MetricCardColor.blue,
  className = "",
}) => {
  const theme = themeClasses[color] || themeClasses.blue;
  const displayValue = formatValue(value, valueType);

  // 3. Lấy icon từ Map, nếu sai tên sẽ fallback về HelpCircle (dấu chấm hỏi)
  const IconComponent = MetricCardIconMap[iconName] || HelpCircle;

  return (
    <div
      className={twMerge(
        "flex-none whitespace-nowrap select-none flex gap-3 p-3 shadow bg-surface-a0 rounded-md border-l-4 duration-200 text-on-surface w-full",
        theme.border,
        className,
      )}
    >
      <div
        className={`flex justify-center items-center p-2 rounded-md aspect-square flex-none ${theme.bg} ${theme.text}`}
      >
        <IconComponent size={iconSize} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm text-gray-600">{name}</p>
        <b className="text-lg">{displayValue}</b>
      </div>
      {children}
    </div>
  );
};
