"use client";

import { LucideImage, Plus } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button, Input, Textarea } from "@/components/ui";

export default function Add() {
  const inputImageFile = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between flex-col h-full">
      <b className="w-full flex justify-center bg-primary p-4 text-xl text-on-primary bg-linear-[135deg] from-primary to-primary-to-mint">
        Thêm cây
      </b>
      <div className="p-2 flex flex-col items-center gap-2 h-[calc(100%)] max-w-xl w-full">
        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              inputImageFile.current?.click();
            }}
            className="w-full flex flex-col items-center p-6 bg-surface-a0 border border-surface-a40 rounded-md text-primary-a40 select-none duration-200 cursor-pointer hover:bg-surface-a10"
          >
            <LucideImage size={32} />
            <p>Ảnh của cây</p>
            <input ref={inputImageFile} type="file" className="hidden" />
          </button>
          <Input
            icon={{ src: "/icons/grow-plant.png", width: 18, height: 18 }}
            label="Tên cây"
            placeholder="Bắc buộc"
          />
          <Input
            icon={{ src: "/icons/open-book.png", width: 18, height: 18 }}
            label="Tên khoa học"
          />
          <div>
            <div className="flex items-center select-none">
              <Image
                src="/icons/pencil.png"
                width={18}
                height={18}
                alt="icon"
                draggable={false}
              />
              <p className="whitespace-nowrap">&nbsp;Ghi chú:</p>
            </div>
            <Textarea className="w-full" />
          </div>
        </div>
        <Button className="flex items-center px-4 w-min">
          <Plus />
          &nbsp;Thêm
        </Button>
      </div>
    </div>
  );
}
