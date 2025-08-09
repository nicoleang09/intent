import { apiUrl, dayList } from './Utils';
import { TaskMap } from './Types';

const days = dayList;

export const taskData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

export const getAllTasks = async (username: string) => {
  let tasks: TaskMap = {};

  const res = await fetch(apiUrl + '/usertasks/' + username);
  const allTasks = await res.json();

  days.forEach((day) => {
    tasks[day] = [];
  });

  for (let task in allTasks) {
    allTasks[task].id = allTasks[task].id.toString();
    let dayName = toTitleCase(allTasks[task].day);
    tasks[dayName].push(allTasks[task]);
  }

  return tasks;
};

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text: string) =>
      text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};

export const addTask = async (name: string, day: string, username?: string) => {
  const data = { title: name, day: day };
  await fetch(apiUrl + '/usertasks/' + username, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateTaskCompleted = (taskId: number, completed: boolean) => {
  const data = {
    updatedCompleted: completed,
  };

  fetch(apiUrl + '/tasks/' + taskId, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteTask = (taskId: number) => {
  fetch(apiUrl + '/tasks/' + taskId, {
    method: 'DELETE',
    mode: 'cors',
  });
};
