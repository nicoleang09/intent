import '../App.css';
import { useEffect, useState } from 'react';
import { WidgetBox } from './ReusableComponents';
import HourlyAgenda from './HourlyAgenda';
import { DragDropContext } from 'react-beautiful-dnd';
import { Task, TaskMap } from '../utils/Types';
import { reorderSchedules } from '../utils/ReorderSchedules';
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

interface TimeBlockProps {
  cookie?: string;
}

function SchedulePlanner(props: TimeBlockProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [schedules, setSchedules] = useState<TaskMap>(scheduleData);

  useEffect(() => {
    if (!props.cookie) return;

    getAllSchedules(props.cookie).then((allTasks) => setSchedules(allTasks));
  }, [props.cookie]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    setSchedules(reorderSchedules(schedules, source, destination));
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

    updateScheduleCompleted(item.id, !item.isCompleted);
    setSchedules(updatedSchedules);
  };

  const onDelete = (item: Task, hour: string) => {
    const hourlyTaskList = schedules[hour];
    const updatedSchedules = {
      ...schedules,
      [hour]: hourlyTaskList.filter((task) => task.id !== item.id),
    };

    deleteSchedule(item.id);
    setSchedules(updatedSchedules);
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

    if (!props.cookie) return;

    addSchedule(name, hour, props.cookie).then(() => {
      if (!props.cookie) return;
      getAllSchedules(props.cookie).then((allTasks) => setSchedules(allTasks));
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
