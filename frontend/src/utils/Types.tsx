export type Task = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export type TaskMap = { [key: string]: Task[] };
