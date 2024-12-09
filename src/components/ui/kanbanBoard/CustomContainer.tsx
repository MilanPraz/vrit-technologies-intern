"use client";
import { ID, TColumn, TTask } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import CustomTask from "./CustomTask";

type CustomContainerProps = {
  column: TColumn;
  handleDeleteColumn: (id: ID) => void;
  handleColumnTitle: (id: ID, title: string) => void;
  handleAddTask: (columnId: ID) => void;
  tasks: TTask[];
  handleDeleteTask: (taskId: ID) => void;
  updateTask: (taskId: ID, content: string) => void;
};

export default function CustomContainer({
  column,
  handleDeleteColumn,
  handleColumnTitle,
  handleAddTask,
  handleDeleteTask,
  tasks,
  updateTask,
}: CustomContainerProps) {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    transform,
    isDragging,
    transition,
    attributes,
    listeners,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="bg-slate-600 opacity-50 border-2 border-purple-600 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  const tasksIds = useMemo(() => {
    const ids = tasks.map((task) => task.id);
    return ids;
  }, [tasks]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-900 w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col shadow-2xl border border-gray-700 overflow-hidden"
    >
      {/* HEADER OF THE COLUMN TABLE */}
      <div
        // {...attributes}
        // {...listeners}
        className="bg-gray-800 px-4 flex items-center justify-between h-[60px] cursor-grab rounded-t-xl font-bold border-b border-gray-700 text-gray-200"
      >
        <div
          onClick={() => setEditMode(true)}
          className="flex text-sm gap-3 items-center group cursor-pointer"
        >
          <div className="flex flex-shrink-0 items-center justify-center h-6 w-6 rounded-full text-xs bg-purple-600 text-white font-semibold group-hover:bg-purple-700 transition-colors">
            {tasks.length}
          </div>
          {!editMode && (
            <span className="group-hover:text-purple-400 transition-colors">
              {column.title}
            </span>
          )}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => handleColumnTitle(column.id, e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              onBlur={() => setEditMode(false)}
              className="bg-gray-700 text-gray-200 outline-none border-2 border-purple-600 rounded-md text-sm py-1 px-2 w-full focus:ring-2 focus:ring-purple-500 transition-all"
            />
          )}
        </div>
        <button
          onClick={() => handleDeleteColumn(column.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* ALL THE TASKS LIST DOWN */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600">
        <SortableContext items={tasksIds}>
          {tasks.map((t, idx) => (
            <div key={idx} className="transition-all duration-200 ease-in-out">
              <CustomTask
                updateTask={updateTask}
                task={t}
                handleDeleteTask={handleDeleteTask}
              />
            </div>
          ))}
        </SortableContext>
      </div>

      {/* ADD TASK BTN */}
      <div className="flex justify-center py-3 border-t border-gray-700 bg-gray-800">
        <button
          onClick={() => handleAddTask(column.id)}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition-colors group"
        >
          <PlusCircle
            size={16}
            className="text-gray-400 group-hover:text-purple-500 transition-colors"
          />
          Add Task
        </button>
      </div>
    </div>
  );
}
