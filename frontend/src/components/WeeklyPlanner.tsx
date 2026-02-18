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
import { AddTaskDialog, AddTaskInfo } from './AddTaskDialog';
import { v4 as uuidv4 } from 'uuid';
import { getStorageTasks, setStorageTasks } from '../utils/local-storage';

interface WeeklyPlannerProps {
  token?: string;
}

function WeeklyPlanner(props: WeeklyPlannerProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskMap>(taskData);
  const [existingValue, setExistingValue] = useState<AddTaskInfo>({
    taskName: '',
    slot: dayList[0],
  });

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

  const handleAddTask = async ({ taskName, slot }: AddTaskInfo) => {
    if (!taskName || !slot) return;

    if (!props.token) {
      const updatedTasks = {
        ...tasks,
        [slot]: [
          ...tasks[slot],
          { id: uuidv4(), title: taskName, isCompleted: false },
        ],
      };
      setStorageTasks(updatedTasks);
      setTasks(updatedTasks);
      setDialogOpen(false);
      return;
    }

    addTask(taskName, slot, props.token).then(() => {
      if (!props.token) return;
      getAllTasks(props.token).then((allTasks) => {
        setStorageTasks(allTasks);
        setTasks(allTasks);
      });
      setDialogOpen(false);
    });
  };

  const handleUpdateTask = async ({ taskName, slot, id }: AddTaskInfo) => {
    if (!taskName || !slot || !id) return;

    const currentDay = Object.keys(tasks).find((d) =>
      tasks[d].some((t) => t.id === id),
    );

    if (!currentDay) return;

    const existingTask = tasks[currentDay].find((t) => t.id === id);

    if (!props.token) {
      const updatedTasks = { ...tasks };
      updatedTasks[currentDay] = updatedTasks[currentDay].filter(
        (t) => t.id !== id,
      );
      updatedTasks[slot] = [
        ...updatedTasks[slot],
        {
          id: id,
          title: taskName,
          isCompleted: existingTask?.isCompleted || false,
        },
      ];
      setStorageTasks(updatedTasks);
      setTasks(updatedTasks);
      setDialogOpen(false);
      return;
    }

    // TODO: implement updateTask in backend and frontend utils
    // updateTask(Number(taskId), name, day, props.token).then(() => {
    //   getAllTasks(props.token!).then((allTasks) => {
    //     setStorageTasks(allTasks);
    //     setTasks(allTasks);
    //   });
    //   setDialogOpen(false);
    // });
  };

  const openAddTaskDialog = (taskInfo?: AddTaskInfo) => {
    setDialogOpen(true);
    setExistingValue(taskInfo || { taskName: '', slot: dayList[0] });
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
            onClick={() => openAddTaskDialog()}
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
                onEditTask={openAddTaskDialog}
                onCloneTask={handleAddTask}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <AddTaskDialog
        slotLabel="Day"
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        onClose={(taskInfo) =>
          taskInfo.id ? handleUpdateTask(taskInfo) : handleAddTask(taskInfo)
        }
        slotList={dayList}
        existingValue={existingValue}
      />
    </>
  );
}

export default WeeklyPlanner;
