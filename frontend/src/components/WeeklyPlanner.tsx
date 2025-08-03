import '../App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../Theme';
import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DialogBox, DottedButton, WidgetBox } from './ReusableComponents';
import DailyTodo from './DailyTodo';
import { DragDropContext } from 'react-beautiful-dnd';
import { TaskMap } from '../utils/Types';
import { reorderTasks } from '../utils/ReorderTasks';
import { getAllTasks, taskData } from '../utils/Tasks';
import { apiUrl, dayList } from '../utils/Utils';
import AddIcon from '@mui/icons-material/Add';

interface WeeklyPlannerProps {
  cookie?: string;
}

function WeeklyPlanner(props: WeeklyPlannerProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskMap>(taskData);
  const [newTaskDay, setNewTaskDay] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    if (!props.cookie) return;

    getAllTasks(props.cookie).then((allTasks) => setTasks(allTasks));
  }, [props.cookie]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    setTasks(reorderTasks(tasks, source, destination));
  };

  const updateTaskCompleted = (taskId: string, completed: boolean) => {
    const data = {
      updatedCompleted: completed,
    };

    fetch(apiUrl + '/tasks/' + taskId, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const toggleCompleted = (id: string) => {
    let tasksArr = Object.entries(tasks);
    let dailyTaskList = tasksArr.find(([key, val]) => {
      let dailyTasks = val;
      let taskWanted = dailyTasks.find((task) => task.id === id);
      return taskWanted !== undefined;
    });

    if (!dailyTaskList) return;

    let taskIdx = dailyTaskList[1].findIndex((t) => t.id === id);
    let isTaskCompleted = dailyTaskList[1][taskIdx].isCompleted;
    dailyTaskList[1][taskIdx].isCompleted = !isTaskCompleted;

    let updatedTasks = {
      ...tasks,
      [dailyTaskList[0]]: dailyTaskList[1],
    };

    updateTaskCompleted(id, !isTaskCompleted);
    setTasks(updatedTasks);
  };

  const dialogActions = [
    { name: 'Cancel', action: () => setDialogOpen(false) },
    {
      name: 'Add',
      action: () => {
        handleAddTask(newTaskName, newTaskDay);
        setDialogOpen(false);
      },
    },
  ];

  const handleClose = () => {
    setDialogOpen(false);
  };

  const showDialog = () => {
    setNewTaskDay('');
    setNewTaskName('');
    setDialogOpen(true);
  };

  const handleAddTask = async (name: string, day: string) => {
    if (!name || !day || !props.cookie) return;

    const data = { title: name, day: day };
    await fetch(apiUrl + '/usertasks/' + props.cookie, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    getAllTasks(props.cookie).then((allTasks) => setTasks(allTasks));
  };

  let theme = createTheme(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <WidgetBox>
        <Grid
          container
          direction={'row'}
          alignItems={'center'}
          marginBottom={'0.5rem'}
        >
          <Typography
            variant="h3"
            marginRight={'0.5rem'}
            color="primaryText"
          >
            This week...
          </Typography>
          <DottedButton onClick={showDialog}>
            <AddIcon fontSize="small" /> Add
          </DottedButton>
        </Grid>

        <Grid
          container
          spacing={2}
        >
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.entries(tasks).map(([key, val]) => (
              <DailyTodo
                internalScroll
                key={key}
                day={key}
                dailyTasks={val}
                onToggleCompleted={toggleCompleted}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <DialogBox
        open={isDialogOpen}
        dialogTitle={'Adding new task...'}
        dialogContent={
          <Box>
            <TextField
              id="task-name"
              label="Task name"
              fullWidth
              variant="standard"
              onChange={(d) => setNewTaskName(d.currentTarget.value)}
              sx={{ marginBottom: '1rem' }}
            />
            <FormControl fullWidth>
              <InputLabel id="day-label">Day</InputLabel>
              <Select
                fullWidth
                labelId="day-label"
                id="day-selection"
                value={newTaskDay}
                label="Day"
                onChange={(event) =>
                  setNewTaskDay(event.target.value as string)
                }
                sx={{ textAlign: 'left' }}
              >
                {dayList.map((day) => {
                  return (
                    <MenuItem
                      value={day}
                      key={day}
                    >
                      {day}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        }
        handleClose={handleClose}
        actions={dialogActions}
      />
    </ThemeProvider>
  );
}

export default WeeklyPlanner;
