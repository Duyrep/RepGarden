"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Icon, Info, PenLine, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FullPageOverlay, Header } from "@/components/layout";
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
import {
  MetricCard,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";
import { type Metric, metricDB } from "@/db/metric";
import { projectDB } from "@/db/project";
import { treeDB } from "@/db/tree";

export default function Metrics() {
  const [isLoading, setIsLoading] = useState(true);
  const treeId = Number(useParams().treeId);
  const projectId = Number(useParams().projectId);

  const [project, tree] = useLiveQuery(async () => {
    const project = await projectDB.projects.get(projectId);
    const tree = await treeDB.trees.get(treeId);
    setIsLoading(false);
    return [project, tree];
  }) ?? [undefined, undefined];

  const metrics = useLiveQuery(
    async () => await metricDB.metrics.where("treeId").equals(treeId).toArray(),
  );

  if (isLoading) return <Loading />;
  if (!project || !tree || !metrics)
    return (
      <FullPageOverlay className="h-[calc(100dvh-var(--bottom-navigation-height))]">
        <div className="flex flex-col items-center">
          <p>Không tìm thấy chỉ số </p>
          <Link href="/my-projects">
            <Button>Quay lại</Button>
          </Link>
        </div>
      </FullPageOverlay>
    );

  return (
    <div>
      <Header
        title="Các chỉ số"
        href={`/project/${projectId}/tree/${treeId}`}
      />
      <div className="pt-[calc(var(--header-height)+1rem)] p-2">
        <div className="flex flex-col gap-2">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} {...metric}>
              <div className="flex items-center justify-end w-full px-4">
                <Button variant="ghost" className="text-on-surface">
                  <PenLine />
                </Button>
              </div>
            </MetricCard>
          ))}
        </div>
        <div className="w-full fixed bottom-[calc(var(--bottom-navigation-height))] flex justify-center">
          <Link href={"metrics/add"}>
            <Button>
              <Plus />
              &nbsp;Thêm chỉ số
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
