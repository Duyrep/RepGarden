import Dexie, { type Table } from "dexie";

export interface Tree {
  id?: number;
  projectId: number;
  name: string;
  description?: string;
  image?: string;
  starred?: boolean;
  createdAt: string;
}

export class TreeDB extends Dexie {
  trees!: Table<Tree>;

  constructor() {
    super("treeDB");

    this.version(2).stores({
      trees: "++id, projectId, name, description, image, starred, createdAt",
    });
  }
}

export const treeDB = new TreeDB();
