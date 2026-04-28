"use client";

import { useEffect } from "react";
import { cleanupGarbageData } from "@/db";

export default function GarbageCollector() {
  useEffect(() => {
    // Chạy dọn rác ngầm sau 3 giây để không ảnh hưởng tốc độ tải trang ban đầu
    const timer = setTimeout(() => {
      cleanupGarbageData();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null; // Component này không hiển thị gì cả
}
