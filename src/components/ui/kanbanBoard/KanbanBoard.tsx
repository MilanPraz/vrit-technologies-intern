"use client";
import React, { useMemo, useState } from "react";
import { CirclePlus } from "lucide-react";
import { ID, TColumn, TTask } from "@/types/types";
import { randomNoGen } from "@/utils/randomNoGenerator";
import CustomContainer from "./CustomContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import CustomTask from "./CustomTask";
import { useKanban } from "@/context/KanbanContext";

export default function KanbanBoard() {
  const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
  const [activeaTask, setActiveTask] = useState<TTask | null>(null);

  const {
    addColumn,
    deleteColumn,
    updateColumnTitle,
    addTask,
    deleteTask,
    updateTask,
    columns,
    tasks,
    moveColumn,
    moveTaskDiffCol,
    moveTaskSameCol,
  } = useKanban();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }

  function onDragEnd(e: DragEndEvent) {
    // setActiveTask(null);
    // const { active, over } = e;
    // if (!over) return;
    // const activeId = active.id;
    // const overId = over.id;
    // if (activeId === overId) return;
    // const activeIndex = tasks.findIndex((t) => t.id === activeId);
    // const overIndex = tasks.findIndex((t) => t.id === overId);
    // const activeColumnIndex = tasks.findIndex(
    //   // (col) => col.id === activeColumnId
    // );
    // const overColumnIndex = tasks.findIndex((col) => col.id === overColumnId);
    // return arrayMove(tasks, activeColumnIndex, overColumnIndex);
    // if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
    //   // moveTask(activeId, tasks[overIndex].columnId);
    // }
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    //WHEN DROPPING TASK ON SAME COLUMN

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      moveTaskSameCol(activeId, overId);
    }

    //WHEN DROPPING TASK ON ANOTHER COLUMN
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverColumn) {
      moveTaskDiffCol(activeId, overId);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //in px
      },
    })
  );

  // TASK RELATED FUNCTIONS

  return (
    <div className="m-auto bg-black text-white flex min-h-screen w-full items-center justify-start  overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className=" flex items-start gap-2">
          {/* LIST OUT ALL THE COLUMNS */}

          <section className="flex items-center gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col, idx) => {
                return (
                  <CustomContainer
                    key={idx}
                    column={col}
                    handleDeleteColumn={deleteColumn}
                    handleColumnTitle={updateColumnTitle}
                    handleDeleteTask={deleteTask}
                    handleAddTask={addTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    updateTask={updateTask}
                  />
                );
              })}
            </SortableContext>
          </section>

          {/* ADD COLUMN BUTTON */}
          <button
            onClick={() => addColumn()}
            className=" flex items-center justify-center gap-2 text-white h-[60px] w-[350px] min-w-[320px] cursor-pointer rounded-lg bg-black border-black ring-rose-500 hover:ring-2"
          >
            <CirclePlus className="" size={20} /> Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <CustomContainer
                column={activeColumn}
                handleDeleteColumn={deleteColumn}
                handleColumnTitle={updateColumnTitle}
                handleAddTask={addTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                handleDeleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeaTask && (
              <CustomTask
                task={activeaTask}
                handleDeleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
