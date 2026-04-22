"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDown, Plus, Star, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Input,
  Loading,
} from "@/components/ui";
import { projectDB } from "@/db/project";
import { type Tree, treeDB } from "@/db/tree";

export default function ProjectTrees() {
  const projectId = Number(useParams().projectId);

  const trees = useLiveQuery(async () => {
    if (Number.isNaN(projectId)) return [];
    return await treeDB.trees.where("projectId").equals(projectId).toArray();
  }, [projectId]);

  const project = useLiveQuery(async () => {
    if (Number.isNaN(projectId)) return null;
    const p = await projectDB.projects.get(projectId);
    return p ?? null;
  }, [projectId]);

  if (project === undefined || trees === undefined) return <Loading />;
  if (!project) return <ProjectNotFound />;

  return (
    <div className="flex flex-col">
      <b className="fixed z-10 w-full text-center p-2 bg-linear-[135deg] from-primary to-primary-to-mint text-2xl text-on-primary">
        Chọn cây
      </b>
      <div className="p-2 grid max-lg:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-12 pb-12">
        {trees?.map((tree) => (
          <TreeItem key={`tree-${tree.id}`} {...{ ...tree, projectId }} />
        ))}
      </div>
      <div className="fixed w-full bottom-(--bottom-navigation-height) flex justify-center">
        <AddTree projectId={projectId} />
      </div>
    </div>
  );
}

function AddTree({ projectId }: { projectId: number }) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await treeDB.trees.add({
        name: name,
        projectId,
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
        <Button>
          <Plus />
          &nbsp;Thêm cây
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Thêm cây</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <label htmlFor="projectName">Tên cây:</label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên cây..."
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
              Thêm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TreeItem({
  projectId,
  id,
  name,
  starred,
}: Tree & { projectId: number }) {
  const [isExtend, setIsExtend] = useState(false);

  const star = () => treeDB.trees.update(id, { starred: !starred });
  const deleteTree = () => treeDB.trees.delete(id);

  return (
    <div className="flex flex-col bg-surface-a0 shadow rounded-md w-full h-min duration-200 hover:shadow-lg">
      <div className="flex items-center p-1">
        {starred && (
          <div className="pl-2 py-2 text-yellow-500">
            <Star />
          </div>
        )}
        <Link
          href={`/project/${projectId}/tree/${id}`}
          className="font-bold w-full p-2 text-lg"
        >
          {name}
        </Link>
        <Button
          variant="ghost"
          className="flex-none aspect-square mr-1 p-2 text-on-surface"
          onClick={() => setIsExtend(!isExtend)}
        >
          <ChevronDown
            className={twMerge(
              "duration-200",
              isExtend ? "rotate-x-180" : "rotate-x-0",
            )}
          />
        </Button>
      </div>
      <div
        className={twMerge(
          "w-full bg-surface-a20 duration-200 overflow-hidden",
          isExtend ? "h-14" : "h-0",
        )}
      >
        <div className="p-2 flex justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className={twMerge(
                "p-1 text-on-surface",
                starred && "text-yellow-500",
              )}
              onClick={star}
            >
              <Star />
            </Button>
            &nbsp;Gắn sao
          </div>
          <div className="flex items-center gap-2">
            <Button>Đổi tên</Button>
            <Button onClick={deleteTree} className="hover:bg-red-500">
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <b className="h-[calc(100dvh-var(--bottom-navigation-height))] flex flex-col text-xl justify-center items-center">
      Không tìm thấy dự án
      <Link href={"/my-projects"}>
        <Button>Quay lại</Button>
      </Link>
    </b>
  );
}
