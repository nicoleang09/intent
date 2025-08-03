import { DraggableLocation } from "react-beautiful-dnd";
import { apiUrl } from "./Utils";
import { Task, TaskMap } from "./Types";

export const reorder = (list: any[], startIdx: number, endIdx: number): any[] => {
  const res = Array.from(list);
  console.log(res);
  const [removed] = res.splice(startIdx, 1);
  res.splice(endIdx, 0, removed);

  return res;
};

const updatedScheduleHour = (task: Task, destName: string) => {
  const scheduleId = task.id;
  const data = {
    "updatedHour": destName.substring(1),
  }

  fetch(apiUrl + "/schedules/" + scheduleId, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
};

export const reorderSchedules = (tasks: TaskMap, source: DraggableLocation, dest: DraggableLocation) => {
  const curr = [...tasks[source.droppableId]];
  const next = [...tasks[dest.droppableId]];
  const target = curr[source.index];

  if (source.droppableId === dest.droppableId) {
    const reordered = reorder(curr, source.index, dest.index);

    return {
      ...tasks,
      [source.droppableId]: reordered
    };
  }

  if (next.length === 1) return tasks;

  curr.splice(source.index, 1);
  next.splice(dest.index, 0, target);

  updatedScheduleHour(next[dest.index], dest.droppableId);

  return {
    ...tasks,
    [source.droppableId]: curr,
    [dest.droppableId]: next
  };
};