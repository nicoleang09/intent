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
import { AddTaskDialog, AddTaskInfo } from './AddTaskDialog';
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
  const [existingValue, setExistingValue] = useState<AddTaskInfo>({
    taskName: '',
    slot: hourList[0],
  });

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

  const handleAddSchedule = async ({ taskName, slot }: AddTaskInfo) => {
    if (!taskName || !slot) return;

    // There is already a schedule at that time slot
    if (schedules['h' + slot]?.length !== 0) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message:
          'There is already a schedule at this time slot. Please pick another time slot.',
      });
      setDialogOpen(false);
      return;
    }

    if (!props.token) {
      const updatedSchedules = {
        ...schedules,
        ['h' + slot]: [{ id: uuidv4(), title: taskName, isCompleted: false }],
      };
      setStorageSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
      setDialogOpen(false);
      return;
    }

    addSchedule(taskName, slot).then(() => {
      if (!props.token) return;
      getAllSchedules(props.token).then((allTasks) => {
        setStorageSchedules(allTasks);
        setSchedules(allTasks);
      });
      setDialogOpen(false);
    });
  };

  const handleUpdateSchedule = async ({ taskName, slot, id }: AddTaskInfo) => {
    if (!taskName || !slot || !id) return;

    const currentHour = Object.keys(schedules).find((d) =>
      schedules[d].some((t) => t.id === id),
    );

    if (!currentHour) return;

    const existingTask = schedules[currentHour].find((t) => t.id === id);

    // Check if there's already a schedule at the new time slot (only if moving to a different slot)
    if (currentHour !== 'h' + slot && schedules['h' + slot]?.length !== 0) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message:
          'There is already a schedule at this time slot. Please pick another time slot.',
      });
      setDialogOpen(false);
      return;
    }

    if (!props.token) {
      const updatedSchedules = { ...schedules };
      updatedSchedules[currentHour] = updatedSchedules[currentHour].filter(
        (t) => t.id !== id,
      );
      updatedSchedules['h' + slot] = [
        ...updatedSchedules['h' + slot],
        {
          id: id,
          title: taskName,
          isCompleted: existingTask?.isCompleted || false,
        },
      ];
      setStorageSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
      setDialogOpen(false);
      return;
    }

    // TODO: implement updateSchedule in backend and frontend utils
    // updateSchedule(Number(id), taskName, slot, props.token).then(() => {
    //   getAllSchedules(props.token!).then((allTasks) => {
    //     setStorageSchedules(allTasks);
    //     setSchedules(allTasks);
    //   });
    //   setDialogOpen(false);
    // });
  };

  const openAddTaskDialog = (taskInfo?: AddTaskInfo) => {
    setDialogOpen(true);
    setExistingValue({
      ...taskInfo,
      slot: taskInfo?.slot.substring(1) || hourList[0],
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
            onClick={() => openAddTaskDialog()}
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
                onEdit={(taskInfo) => openAddTaskDialog(taskInfo)}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <AddTaskDialog
        slotLabel="Hour"
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        onClose={(taskInfo) =>
          taskInfo.id
            ? handleUpdateSchedule(taskInfo)
            : handleAddSchedule(taskInfo)
        }
        slotList={hourList}
        existingValue={existingValue}
      />
    </>
  );
}

export default SchedulePlanner;
