import Dexie, { type Table } from "dexie";
import type {
  MetricCardColor,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";

export interface Metric {
  id?: number;
  treeId: number;
  name: string;
  iconName: MetricCardIcons;
  value: string | number;
  valueType: MetricValueType;
  color: MetricCardColor;
  createdAt: string;
}

export class MetricDB extends Dexie {
  metrics!: Table<Metric>;

  constructor() {
    super("MetricDB");

    this.version(1).stores({
      metrics:
        "++id, treeId, name, iconName, value, valueType, color, createdAt",
    });
  }
}

export const metricDB = new MetricDB();
