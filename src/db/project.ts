import Dexie, { type Table } from "dexie";

export interface Project {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
}

export class ProjectDB extends Dexie {
  projects!: Table<Project>;

  constructor() {
    super("ProjectDB");

    this.version(1).stores({
      projects: "++id, name, description, image, createdAt",
    });
  }
}

export const projectDB = new ProjectDB();
