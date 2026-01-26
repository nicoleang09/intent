export type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type TaskMap = { [key: string]: Task[] };
