import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/add"}>
        <Plus />
      </Link>
    </div>
  );
}
