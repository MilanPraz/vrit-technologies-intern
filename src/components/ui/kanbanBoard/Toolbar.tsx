"use client";
import React from "react";
// import { Button } from "../ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { useKanban } from "@/context/KanbanContext";
// import { useDiagramContext } from "@/providers/DiagramProvider";

export default function Toolbar() {
  const { undo, redo, canUndo, canRedo } = useKanban();
  return (
    <div>
      <div className="relative z-50  flex space-x-6 text-black p-2 bg-gray-100 rounded-md">
        <button
          onClick={() => {
            undo();
          }}
          disabled={!canUndo}
          className="disabled:text-gray-500"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          className="disabled:text-gray-500"
          onClick={() => redo()}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
