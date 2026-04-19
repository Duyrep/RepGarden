"use client";

import {
  ArrowLeft,
  BookOpen,
  Droplet,
  Info,
  Ruler,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { MetricCard } from "@/components/ui/MetricCard";
import { type Project, projectDB } from "@/db/project";
import { type Tree, treeDB } from "@/db/tree";

export default function ProjectPage() {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [tree, setTree] = useState<Tree | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [found, setFound] = useState(false);
  const projectId = Number(useParams().projectId as string);
  const treeId = Number(useParams().treeId as string);

  useEffect(() => {
    const run = async () => {
      if (Number.isNaN(projectId) || Number.isNaN(treeId)) {
        setIsLoading(false);
        setFound(false);
        return;
      }

      const project = await projectDB.projects.get(projectId);
      const tree = await treeDB.trees.get(treeId);

      setProject(project);
      setTree(tree);

      if (project) {
        setFound(true);
      }

      if (tree) {
        setFound(true);
      }
      setIsLoading(false);
    };

    run();
  }, [projectId, treeId]);

  if (isLoading) return <Loading />;
  if (!found || !project || !tree) return <TreeNotFound />;

  return (
    <>
      <div className="fixed z-10 w-full flex gap-4 items-center text-lg p-2 bg-surface-a0">
        <Link href={"/my-projects"}>
          <ArrowLeft />
        </Link>
        <b>{project.name}</b>
      </div>
      <div className="p-2 flex flex-col gap-4 pt-14">
        <div className="flex flex-col gap-4 bg-linear-[135deg] from-primary to-primary-to-mint rounded-2xl p-4 text-xl font-bold text-on-primary">
          {tree.name}
          <Button
            variant="secondary"
            className="font-normal w-min whitespace-nowrap"
          >
            + Viết nhật ký ngày hôm nay
          </Button>
        </div>
        <div>
          <Link
            href={`/project/${project.id}/tree/${tree.id}/metrics`}
            className="w-full text-end text-primary text-lg px-2 pb-2"
          >
            Xem tất cả chỉ số
          </Link>
          <div className="grid max-lg:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
            <MetricCard
              title="Chiều cao"
              value={"28cm"}
              valueType="raw"
              color="blue"
              icon={<Ruler size={28} />}
            />

            <MetricCard
              title="Nhiệt độ"
              value={28}
              valueType="temperature"
              color="red"
              icon={<Thermometer size={28} />}
            />

            <MetricCard
              title="Độ ẩm"
              value={75}
              valueType="percentage"
              color="cyan"
              icon={<Droplet size={28} />}
            />

            <MetricCard
              title="Số ngày đã ghi nhận"
              value={7}
              valueType="days"
              color="green"
              icon={<BookOpen size={28} />}
            />

            <MetricCard
              title="Trạng thái"
              value="Hoạt động tốt"
              color="blue"
              icon={<Info size={28} />}
            />
          </div>
        </div>

        <div className="flex flex-col bg-surface-a0 rounded-md shadow p-3">
          <b className="text-lg">Nhật ký ảnh hằng ngày</b>
          <p className="text-primary">Xem tất cả</p>
          <div className="grid max-lg:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-5">
            {[...Array(4)].map((_, i) => (
              <b
                key={crypto.randomUUID()}
                className="aspect-video w-full flex justify-center items-center bg-surface-a10 rounded-md border border-surface-a50"
              >
                Ngày {i + 1}
              </b>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Loading() {
  return (
    <b className="text-xl flex h-full justify-center items-center">
      Đang tải...
    </b>
  );
}

function TreeNotFound() {
  return (
    <b className="text-xl flex h-full justify-center items-center">
      Không tìm thấy cây
    </b>
  );
}
