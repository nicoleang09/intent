export type Task = {
  id: number | string;
  title: string;
  isCompleted: boolean;
};

export type TaskMap = { [key: string]: Task[] };
