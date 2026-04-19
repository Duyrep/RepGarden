import Dexie, { type Table } from "dexie";

export interface Metric {
  id?: number;
  projectId: number;
  name: string;
  iconName: string;
  value: string;
  valueType: string;
  color: string;
  createdAt: string;
}

export class MetricDB extends Dexie {
  metrics!: Table<Metric>;

  constructor() {
    super("MetricDB");

    this.version(1).stores({
      metrics:
        "++id, projectId, name, iconName, value, valueType, color, createdAt",
    });
  }
}

export const metricDB = new MetricDB();
