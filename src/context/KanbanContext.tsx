"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ID, TColumn, TTask } from "@/types/types";
import { randomNoGen } from "@/utils/randomNoGenerator";
import { arrayMove } from "@dnd-kit/sortable";

type KanbanContextType = {
  columns: TColumn[];
  tasks: TTask[];
  addColumn: () => void;
  deleteColumn: (id: ID) => void;
  updateColumnTitle: (id: ID, title: string) => void;
  addTask: (columnId: ID) => void;
  deleteTask: (taskId: ID) => void;
  updateTask: (taskId: ID, content: string) => void;
  moveTaskSameCol: (activeId: any, overId: any) => void;
  moveTaskDiffCol: (activeId: any, overId: any) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  moveTask: (taskId: ID, newColumnId: ID) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};

type HistoryState = {
  columns: TColumn[];
  tasks: TTask[];
};

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [columns, setColumns] = useState<TColumn[]>([]);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const savedState = localStorage.getItem("kanbanState");
    if (savedState) {
      const { columns: savedColumns, tasks: savedTasks } =
        JSON.parse(savedState);
      setColumns(savedColumns);
      setTasks(savedTasks);
      setHistory([{ columns: savedColumns, tasks: savedTasks }]);
      setHistoryIndex(0);
    }
  }, []);

  const saveState = (newColumns: TColumn[], newTasks: TTask[]) => {
    localStorage.setItem(
      "kanbanState",
      JSON.stringify({ columns: newColumns, tasks: newTasks })
    );
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      { columns: newColumns, tasks: newTasks },
    ]);
    setHistoryIndex((prev) => prev + 1);
  };

  const addColumn = () => {
    const newCol: TColumn = {
      id: randomNoGen(),
      title: `Column no. ${columns.length}`,
    };
    const newColumns = [...columns, newCol];
    setColumns(newColumns);
    saveState(newColumns, tasks);
  };

  const deleteColumn = (id: ID) => {
    const newColumns = columns.filter((col) => col.id !== id);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setColumns(newColumns);
    setTasks(newTasks);
    saveState(newColumns, newTasks);
  };

  const updateColumnTitle = (id: ID, title: string) => {
    const newColumns = columns.map((col) =>
      col.id !== id ? col : { ...col, title }
    );
    setColumns(newColumns);
    saveState(newColumns, tasks);
  };

  const addTask = (columnId: ID) => {
    const newTask: TTask = {
      id: randomNoGen(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveState(columns, newTasks);
  };

  const deleteTask = (taskId: ID) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
    saveState(columns, newTasks);
  };

  const updateTask = (taskId: ID, content: string) => {
    const newTasks = tasks.map((task) =>
      task.id !== taskId ? task : { ...task, content }
    );
    setTasks(newTasks);
    saveState(columns, newTasks);
  };

  const moveTaskSameCol = (activeId: string, overId: string) => {
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      tasks[activeIndex].columnId = tasks[overIndex].columnId;

      return arrayMove(tasks, activeIndex, overIndex);
    });
  };
  const moveTaskDiffCol = (activeId: string, overId: string) => {
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      tasks[activeIndex].columnId = overId;

      return arrayMove(tasks, activeIndex, activeIndex);
    });
  };
  //   const moveTask = (taskId: ID, newColumnId: ID) => {
  //     const newTasks = tasks.map((task) =>
  //       task.id !== taskId ? task : { ...task, columnId: newColumnId }
  //     );
  //     setTasks(newTasks);
  //     saveState(columns, newTasks);
  //   };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [removed] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, removed);
    setColumns(newColumns);
    saveState(newColumns, tasks);
  };

  const moveTask = useCallback(
    (taskId: ID, newColumnId: ID) => {
      const newTasks = tasks.map((task) =>
        task.id !== taskId ? task : { ...task, columnId: newColumnId }
      );
      setTasks(newTasks);
      saveState(columns, newTasks);
    },
    [columns, tasks, saveState]
  );

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      const prevState = history[historyIndex - 1];
      setColumns(prevState.columns);
      setTasks(prevState.tasks);
      localStorage.setItem("kanbanState", JSON.stringify(prevState));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      const nextState = history[historyIndex + 1];
      setColumns(nextState.columns);
      setTasks(nextState.tasks);
      localStorage.setItem("kanbanState", JSON.stringify(nextState));
    }
  };

  const value = {
    columns,
    tasks,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    addTask,
    deleteTask,
    updateTask,
    moveTaskSameCol,
    moveTaskDiffCol,
    moveColumn,
    moveTask,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
