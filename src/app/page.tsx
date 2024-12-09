"use client";
const KanbanBoard = dynamic(
  () => import("@/components/ui/kanbanBoard/KanbanBoard"),
  { ssr: false }
);
import Toolbar from "@/components/ui/kanbanBoard/Toolbar";
import dynamic from "next/dynamic";
// import KanbanBoard from "@/components/ui/kanbanBoard/KanbanBoard";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" relative">
      <div
        className=" absolute right-4 top-4
      "
      >
        <Toolbar />
      </div>
      <KanbanBoard />
    </div>
  );
}
