import '../App.css';
import { useEffect, useState } from 'react';
import { WidgetBox } from './ReusableComponents';
import DailyAgenda from './DailyAgenda';
import { DragDropContext } from 'react-beautiful-dnd';
import { Task, TaskMap } from '../utils/Types';
import { reorderSessionTasks, reorderTasks } from '../utils/ReorderTasks';
import {
  addTask,
  deleteTask,
  getAllTasks,
  taskData,
  updateTaskCompleted,
} from '../utils/Tasks';
import { dayList } from '../utils/Utils';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, Title } from '@mantine/core';
import { AddTaskDialog } from './AddTaskDialog';
import { v4 as uuidv4 } from 'uuid';
import { getStorageTasks, setStorageTasks } from '../utils/local-storage';

interface WeeklyPlannerProps {
  token?: string;
}

function WeeklyPlanner(props: WeeklyPlannerProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskMap>(taskData);

  useEffect(() => {
    if (!props.token) {
      setTasks(getStorageTasks());
      return;
    }

    getAllTasks(props.token).then((allTasks) => setTasks(allTasks));
  }, [props.token]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    const reorderedTasks = props.token
      ? reorderTasks(tasks, source, destination)
      : reorderSessionTasks(tasks, source, destination);

    setStorageTasks(reorderedTasks);
    setTasks(reorderedTasks);
  };

  const toggleCompleted = (item: Task, day: string) => {
    const dailyTaskList = tasks[day];
    const updatedTasks = {
      ...tasks,
      [day]: dailyTaskList.map((task) => {
        if (task.id !== item.id) return task;
        return { ...task, isCompleted: !task.isCompleted };
      }),
    };

    setStorageTasks(updatedTasks);
    setTasks(updatedTasks);

    if (!props.token) return;

    updateTaskCompleted(Number(item.id), !item.isCompleted);
  };

  const onDelete = (item: Task, day: string) => {
    const dailyTaskList = tasks[day];
    const updatedTasks = {
      ...tasks,
      [day]: dailyTaskList.filter((task) => task.id !== item.id),
    };

    setStorageTasks(updatedTasks);
    setTasks(updatedTasks);

    if (!props.token) return;

    deleteTask(Number(item.id));
  };

  const handleAddTask = async (name: string, day: string) => {
    if (!props.token) {
      const updatedTasks = {
        ...tasks,
        [day]: [
          ...tasks[day],
          { id: uuidv4(), title: name, isCompleted: false },
        ],
      };
      setStorageTasks(updatedTasks);
      setTasks(updatedTasks);
      setDialogOpen(false);
      return;
    }

    addTask(name, day, props.token).then(() => {
      if (!props.token) return;
      getAllTasks(props.token).then((allTasks) => {
        setStorageTasks(allTasks);
        setTasks(allTasks);
      });
      setDialogOpen(false);
    });
  };

  return (
    <>
      <WidgetBox>
        <Grid style={{ marginBottom: '1rem', alignItems: 'center' }}>
          <Title
            order={2}
            style={{ marginRight: '0.5rem', flexGrow: 1 }}
          >
            This week...
          </Title>
          <Button
            variant="light"
            radius="xl"
            onClick={() => setDialogOpen(true)}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        </Grid>

        <Grid gutter={20}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.entries(tasks).map(([key, val]) => (
              <DailyAgenda
                internalScroll
                key={key}
                day={key}
                dailyTasks={val}
                onToggleCompleted={toggleCompleted}
                onDelete={onDelete}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <AddTaskDialog
        slotLabel="Day"
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        handleAddTask={handleAddTask}
        slotList={dayList}
      />
    </>
  );
}

export default WeeklyPlanner;
