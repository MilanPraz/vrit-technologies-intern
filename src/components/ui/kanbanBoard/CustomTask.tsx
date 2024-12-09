"use client";
import { ID, TTask } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

type CustomTaskProps = {
  task: TTask;
  handleDeleteTask: (taskId: ID) => void;
  updateTask: (taskId: ID, content: string) => void;
};

export default function CustomTask({
  task,
  handleDeleteTask,
  updateTask,
}: CustomTaskProps) {
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const {
    setNodeRef,
    transform,
    isDragging,
    transition,
    attributes,
    listeners,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative group bg-gray-800 p-3 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border border-gray-700 hover:border-purple-600 transition-all duration-300 cursor-grab"
      >
        <textarea
          value={task.content}
          autoFocus
          placeholder="Write your task here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className="h-[90%] w-full resize-none border-none bg-transparent text-gray-200 focus:outline-none placeholder-gray-500 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600"
        />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative opacity-50 bg-gray-800 p-3 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border border-purple-600 cursor-grab"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => toggleEditMode()}
      className="task relative group bg-gray-800 p-3 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border border-transparent hover:border-purple-600 transition-all duration-300 cursor-grab"
    >
      <p className="w-full h-[90%] overflow-x-hidden overflow-y-auto whitespace-pre-wrap text-gray-300 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600">
        {task.content}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteTask(task.id);
        }}
        className="absolute opacity-0 group-hover:opacity-100 right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-300"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
