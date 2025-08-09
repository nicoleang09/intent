import '../App.css';
import { useEffect, useState } from 'react';
import { WidgetBox } from './ReusableComponents';
import DailyAgenda from './DailyAgenda';
import { DragDropContext } from 'react-beautiful-dnd';
import { Task, TaskMap } from '../utils/Types';
import { reorderTasks } from '../utils/ReorderTasks';
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

interface WeeklyPlannerProps {
  cookie?: string;
}

function WeeklyPlanner(props: WeeklyPlannerProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskMap>(taskData);

  useEffect(() => {
    if (!props.cookie) return;

    getAllTasks(props.cookie).then((allTasks) => setTasks(allTasks));
  }, [props.cookie]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    setTasks(reorderTasks(tasks, source, destination));
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

    updateTaskCompleted(item.id, !item.isCompleted);
    setTasks(updatedTasks);
  };

  const onDelete = (item: Task, day: string) => {
    const dailyTaskList = tasks[day];
    const updatedTasks = {
      ...tasks,
      [day]: dailyTaskList.filter((task) => task.id !== item.id),
    };

    deleteTask(item.id);
    setTasks(updatedTasks);
  };

  const handleAddTask = async (name: string, day: string) => {
    if (!props.cookie) return;

    addTask(name, day, props.cookie).then(() => {
      if (!props.cookie) return;
      getAllTasks(props.cookie).then((allTasks) => setTasks(allTasks));
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
