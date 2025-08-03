export type Task = {
  id: string,
  name: string,
  completed: boolean,
};

export type TaskMap = { [key: string]: Task[] };