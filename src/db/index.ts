import Dexie, { type Table } from "dexie";
import type {
  MetricCardColor,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";

// ==========================================
// 1. ĐỊNH NGHĨA CÁC INTERFACES (MODELS)
// ==========================================

export interface Project {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
}

export interface Tree {
  id?: number;
  projectId: number;
  name: string;
  scientificName?: string;
  description?: string;
  image?: string;
  starred?: boolean;
  note?: string;
  createdAt: string;
}

export interface Metric {
  id?: number;
  treeId: number;
  name: string;
  iconName: MetricCardIcons;
  value: string | number;
  valueType: MetricValueType;
  color: MetricCardColor;
  createdAt: string;
}

export interface Image {
  id: string; // Sử dụng UUID làm ID
  file: File;
  createdAt: string;
}

// CẬP NHẬT: Bản ghi chỉ số hằng ngày giờ cực kỳ gọn nhẹ
export interface DailyMetricRecord {
  metricId: number; // Liên kết bắt buộc tới ID của bảng metrics gốc
  value: string | number; // Giá trị đo được trong ngày hôm đó
}

export interface DailyMoment {
  id?: number;
  treeId: number;
  title: string;
  datetime: string;
  images: string[];
  note?: string;
  metrics?: DailyMetricRecord[]; // Thay vì lưu Snapshot, ta lưu mảng Record
  createdAt: string;
}

// ==========================================
// 2. KHỞI TẠO DATABASE HỢP NHẤT (APP DB)
// ==========================================

export class AppDatabase extends Dexie {
  projects!: Table<Project, number>;
  trees!: Table<Tree, number>;
  metrics!: Table<Metric, number>;
  dailyMoments!: Table<DailyMoment, number>;
  images!: Table<Image, string>;

  constructor() {
    super("RepGardenAppDB");

    // Các trường index (chỉ mục) phục vụ việc tìm kiếm nhanh
    this.version(1).stores({
      projects: "++id, name, createdAt",
      trees: "++id, projectId, starred, createdAt",
      metrics: "++id, treeId, createdAt",
      dailyMoments: "++id, treeId, datetime, createdAt",
      images: "id, createdAt",
    });
  }
}

// Export một instance duy nhất
export const appDB = new AppDatabase();

// ==========================================
// 3. HÀM DỌN DẸP DỮ LIỆU RÁC (GARBAGE COLLECTION)
// ==========================================

export async function cleanupGarbageData() {
  try {
    await appDB.transaction(
      "rw",
      [
        appDB.projects,
        appDB.trees,
        appDB.metrics,
        appDB.dailyMoments,
        appDB.images,
      ],
      async () => {
        // 1. Lấy danh sách ID của tất cả Project hợp lệ
        const validProjectIds = new Set(
          await appDB.projects.toCollection().primaryKeys(),
        );

        // 2. Lọc Cây (Tree) rác & Gom ID Cây hợp lệ
        const treesToDelete: number[] = [];
        const validTreeIds = new Set<number>();

        await appDB.trees.each((tree) => {
          if (!validProjectIds.has(tree.projectId)) {
            treesToDelete.push(tree.id!);
          } else {
            validTreeIds.add(tree.id!);
          }
        });
        if (treesToDelete.length) await appDB.trees.bulkDelete(treesToDelete);

        // 3. Lọc Chỉ số (Metric) rác
        const metricsToDelete: number[] = [];
        await appDB.metrics.each((metric) => {
          if (!validTreeIds.has(metric.treeId)) {
            metricsToDelete.push(metric.id!);
          }
        });
        if (metricsToDelete.length)
          await appDB.metrics.bulkDelete(metricsToDelete);

        // 4. Lọc Nhật ký (DailyMoment) rác & Gom ID Hình ảnh (Image) hợp lệ
        const momentsToDelete: number[] = [];
        const usedImageIds = new Set<string>();

        await appDB.dailyMoments.each((dm) => {
          if (!validTreeIds.has(dm.treeId)) {
            momentsToDelete.push(dm.id!);
          } else {
            if (dm.images && dm.images.length > 0) {
              dm.images.map((imgId) => usedImageIds.add(imgId));
            }
          }
        });
        if (momentsToDelete.length)
          await appDB.dailyMoments.bulkDelete(momentsToDelete);

        // 5. ĐÃ SỬA LỖI: Lọc Hình ảnh (Image) rác bằng primaryKeys()
        const allImageIds = await appDB.images.toCollection().primaryKeys();

        // Chỉ giữ lại những ID không nằm trong tập usedImageIds (tức là ảnh mồ côi)
        const imagesToDelete = allImageIds.filter(
          (imgId) => !usedImageIds.has(imgId),
        );

        if (imagesToDelete.length) {
          await appDB.images.bulkDelete(imagesToDelete);
        }

        // Log kết quả
        if (
          treesToDelete.length ||
          metricsToDelete.length ||
          momentsToDelete.length ||
          imagesToDelete.length
        ) {
          console.log("🧹 [Garbage Collector] Đã dọn dẹp:", {
            trees: treesToDelete.length,
            metrics: metricsToDelete.length,
            moments: momentsToDelete.length,
            images: imagesToDelete.length,
          });
        }
      },
    );
  } catch (error) {
    console.error("Lỗi khi chạy Garbage Collector:", error);
  }
}
