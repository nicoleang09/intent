export type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

export type TaskMap = { [key: string]: Task[] };
