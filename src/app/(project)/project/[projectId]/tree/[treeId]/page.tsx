"use client";

import { useLiveQuery } from "dexie-react-hooks";
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
import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Loading } from "@/components/ui";
import { MetricCard } from "@/components/ui/MetricCard";
import { metricDB } from "@/db/metric";
import { projectDB } from "@/db/project";
import { treeDB } from "@/db/tree";

export default function ProjectPage() {
  const projectId = Number(useParams().projectId as string);
  const treeId = Number(useParams().treeId as string);

  const [isLoading, setIsLoading] = useState(true);

  const tree = useLiveQuery(async () => await treeDB.trees.get(treeId));
  const metrics = useLiveQuery(
    async () => await metricDB.metrics.where("treeId").equals(treeId).toArray(),
  );
  const project = useLiveQuery(async () => {
    const data = await projectDB.projects.get(projectId);
    setIsLoading(false);
    return data;
  }, [projectId]);

  if (isLoading) return <Loading />;
  if (!project || !tree) return <TreeNotFound />;

  return (
    <>
      <Header title={project.name} href={`/project/${projectId}`} />
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
            {metrics?.map((metric) => (
              <MetricCard key={metric.id} {...metric} />
            ))}
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

function TreeNotFound() {
  return (
    <b className="text-xl flex h-full justify-center items-center">
      Không tìm thấy cây
    </b>
  );
}
