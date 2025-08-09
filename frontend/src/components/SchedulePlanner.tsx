import '../App.css';
import { useEffect, useState } from 'react';
import { WidgetBox } from './ReusableComponents';
import HourlyAgenda from './HourlyAgenda';
import { DragDropContext } from 'react-beautiful-dnd';
import { Task, TaskMap } from '../utils/Types';
import {
  reorderSchedules,
  reorderSessionSchedules,
} from '../utils/ReorderSchedules';
import {
  addSchedule,
  deleteSchedule,
  getAllSchedules,
  scheduleData,
  updateScheduleCompleted,
} from '../utils/Schedules';
import { hourList } from '../utils/Utils';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, Title } from '@mantine/core';
import { AddTaskDialog } from './AddTaskDialog';
import { notifications } from '@mantine/notifications';
import { v4 as uuidv4 } from 'uuid';
import {
  getStorageSchedules,
  setStorageSchedules,
} from '../utils/local-storage';

interface TimeBlockProps {
  token?: string;
}

function SchedulePlanner(props: TimeBlockProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [schedules, setSchedules] = useState<TaskMap>(scheduleData);

  useEffect(() => {
    if (!props.token) {
      setSchedules(getStorageSchedules());
      return;
    }

    getAllSchedules(props.token).then((allTasks) => {
      setStorageSchedules(allTasks);
      setSchedules(allTasks);
    });
  }, [props.token]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    const reorderedSchedules = props.token
      ? reorderSchedules(schedules, source, destination)
      : reorderSessionSchedules(schedules, source, destination);

    setStorageSchedules(reorderedSchedules);
    setSchedules(reorderedSchedules);
  };

  const toggleCompleted = (item: Task, hour: string) => {
    const hourlyTaskList = schedules[hour];
    const updatedSchedules = {
      ...schedules,
      [hour]: hourlyTaskList.map((task) => {
        if (task.id !== item.id) return task;
        return { ...task, isCompleted: !task.isCompleted };
      }),
    };

    setStorageSchedules(updatedSchedules);
    setSchedules(updatedSchedules);

    if (!props.token) {
      return;
    }

    updateScheduleCompleted(Number(item.id), !item.isCompleted);
  };

  const onDelete = (item: Task, hour: string) => {
    const hourlyTaskList = schedules[hour];
    const updatedSchedules = {
      ...schedules,
      [hour]: hourlyTaskList.filter((task) => task.id !== item.id),
    };

    setStorageSchedules(updatedSchedules);
    setSchedules(updatedSchedules);

    if (!props.token) {
      return;
    }

    deleteSchedule(Number(item.id));
  };

  const handleAddSchedule = async (name: string, hour: string) => {
    // There is already a schedule at that time slot
    if (schedules['h' + hour]?.length !== 0) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message:
          'There is already a schedule at this time slot. Please pick another time slot.',
      });
      return;
    }

    if (!props.token) {
      const updatedSchedules = {
        ...schedules,
        ['h' + hour]: [{ id: uuidv4(), title: name, isCompleted: false }],
      };
      setStorageSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
      setDialogOpen(false);
      return;
    }

    addSchedule(name, hour).then(() => {
      if (!props.token) return;
      getAllSchedules(props.token).then((allTasks) => {
        setStorageSchedules(allTasks);
        setSchedules(allTasks);
      });
      setDialogOpen(false);
    });
  };

  return (
    <>
      <WidgetBox>
        <Grid
          align={'center'}
          style={{ marginBottom: '1rem' }}
        >
          <Title
            order={2}
            style={{ marginRight: '0.5rem', flexGrow: 1 }}
          >
            Today...
          </Title>
          <Button
            variant="light"
            radius="xl"
            onClick={() => setDialogOpen(true)}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        </Grid>

        <Grid>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.entries(schedules).map(([key, val]) => (
              <HourlyAgenda
                internalScroll
                key={key}
                hour={key}
                dailyTasks={val}
                onToggleCompleted={toggleCompleted}
                onDelete={onDelete}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <AddTaskDialog
        slotLabel="Hour"
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        handleAddTask={handleAddSchedule}
        slotList={hourList}
      />
    </>
  );
}

export default SchedulePlanner;
