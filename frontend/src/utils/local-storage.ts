import { scheduleData } from './Schedules';
import { taskData } from './Tasks';
import { TaskMap } from './Types';

export interface AppLocalStorage {
  tasks: TaskMap;
  schedules: TaskMap;
}

export const getLocalStorage = (): AppLocalStorage => {
  const storage = localStorage.getItem('intentData');

  if (!storage) {
    return { tasks: taskData, schedules: scheduleData };
  }

  return JSON.parse(storage);
};

export const getStorageTasks = (): TaskMap => {
  const storage = getLocalStorage();

  if (!storage) {
    return taskData;
  }

  return storage.tasks;
};

export const getStorageSchedules = (): TaskMap => {
  const storage = getLocalStorage();

  if (!storage) {
    return scheduleData;
  }

  return storage.schedules;
};

export const setLocalStorage = (storage: AppLocalStorage): void => {
  localStorage.setItem('intentData', JSON.stringify(storage));
};

export const setStorageTasks = (tasks: TaskMap): void => {
  const storage = getLocalStorage();
  storage.tasks = tasks;
  setLocalStorage(storage);
};

export const setStorageSchedules = (schedules: TaskMap): void => {
  const storage = getLocalStorage();
  storage.schedules = schedules;
  setLocalStorage(storage);
};
