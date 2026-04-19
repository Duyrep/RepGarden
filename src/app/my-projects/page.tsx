"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/ui";
import { projectDB } from "@/db/project";

export default function MyProject() {
  const projects = useLiveQuery(() =>
    projectDB.projects.orderBy("id").reverse().toArray(),
  );

  if (projects === undefined) {
    return (
      <div className="text-center p-8 text-gray-500">Đang tải dự án...</div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <AddProject />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <b className="text-center p-2 bg-primary text-2xl text-on-primary">
        Dự án của tôi
      </b>
      <div className="flex flex-col p-2 gap-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex gap-2 items-center w-full bg-surface-a0 rounded-md p-1 shadow duration-200 cursor-pointer hover:shadow-md"
          >
            <Link
              href={`/project/${project.id}`}
              className="w-full px-2 text-xl font-bold"
            >
              {project.name}
            </Link>
            <Button onClick={() => projectDB.projects.delete(project.id)}>
              <Trash />
            </Button>
          </div>
        ))}
        <AddProject />
      </div>
    </div>
  );
}

function AddProject() {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await projectDB.projects.add({
        name: name,
        createdAt: new Date().toISOString(),
      });

      setName("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Thêm dự án</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Thêm dự án</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <label htmlFor="projectName">Tên dự án:</label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên dự án..."
              autoFocus
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Lưu dự án
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
