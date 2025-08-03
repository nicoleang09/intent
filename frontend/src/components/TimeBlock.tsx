import '../App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../Theme'
import { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import { DialogBox, DottedButton, WidgetBox } from './ReusableComponents';
import ScheduleSlot from './ScheduleSlot';
import { DragDropContext } from 'react-beautiful-dnd';
import { TaskMap } from '../utils/Types';
import { reorderSchedules } from '../utils/ReorderSchedules';
import { getAllSchedules, scheduleData } from '../utils/Schedules';
import { apiUrl, hourList } from '../utils/Utils';
import AddIcon from '@mui/icons-material/Add';

interface TimeBlockProps {
  cookie?: string;
};

function TimeBlock(props: TimeBlockProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [schedules, setSchedules] = useState<TaskMap>(scheduleData);
  const [newScheduleHour, setNewScheduleHour] = useState("");
  const [newScheduleName, setNewScheduleName] = useState("");

  useEffect(() => {
    if (!props.cookie) return;

    getAllSchedules(props.cookie).then(allTasks => setSchedules(allTasks));
  }, [props.cookie]);

  const handleOnDragEnd = (res: any) => {
    const { source, destination } = res;

    if (!destination) return;

    setSchedules(reorderSchedules(schedules, source, destination));
  };

  const updateTaskCompleted = (taskId: string, completed: boolean) => {
    const data = {
      "updatedCompleted": completed,
    }
  
    fetch(apiUrl + "/schedules/" + taskId, {
      method: "POST",
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
  };

  const toggleCompleted = (id: string) => {
    let schedulesArr = Object.entries(schedules);
    let dailyTaskList = schedulesArr.find(([key, val]) => {
      let dailyTasks = val;
      let taskWanted = dailyTasks.find(task => task.id === id);
      return taskWanted !== undefined;
    });

    if (!dailyTaskList) return;
    
    let taskIdx = dailyTaskList[1].findIndex(t => t.id === id);
    let isTaskCompleted = dailyTaskList[1][taskIdx].completed;
    dailyTaskList[1][taskIdx].completed = !isTaskCompleted;

    let updatedTasks = {
      ...schedules,
      [dailyTaskList[0]]: dailyTaskList[1]
    };

    updateTaskCompleted(id, !isTaskCompleted);
    setSchedules(updatedTasks);
  };

  const dialogActions = [
    {name: "Cancel", action: () => setDialogOpen(false)},
    {name: "Add", action: () => {handleAddSchedule(newScheduleName, newScheduleHour); setDialogOpen(false);}}
  ];

  const handleClose = () => {
    setDialogOpen(false);
  };

  const showDialog = () => {
    setNewScheduleHour("");
    setNewScheduleName("");
    setDialogOpen(true);
  };

  const handleAddSchedule = async (name: string, hour: string) => {
    if (!name || !hour || !props.cookie) return;

    // There is already a schedule at that time slot
    console.log('new schedule hour: ' + hour);
    if (schedules['h' + hour].length !== 0) return;

    const data = {name: name, hour: hour};
    await fetch(apiUrl + "/userschedules/" + props.cookie, {
      method: "POST",
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    getAllSchedules(props.cookie).then(allTasks => setSchedules(allTasks));
  };

  let theme = createTheme(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <WidgetBox>
        <Grid container direction={"row"} alignItems={"center"} marginBottom={"0.5rem"}>
          <Typography variant="h3" marginRight={"0.5rem"}>Today...</Typography>
          <DottedButton onClick={showDialog}><AddIcon fontSize="small" /> Add</DottedButton>
        </Grid>

        <Grid container>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.entries(schedules).map(([key, val]) => (
              <ScheduleSlot
                internalScroll
                key={key}
                hour={key}
                dailyTasks={val}
                onToggleCompleted={toggleCompleted}
              />
            ))}
          </DragDropContext>
        </Grid>
      </WidgetBox>

      <DialogBox
        open={isDialogOpen}
        dialogTitle={"Adding new schedule..."}
        dialogContent={
          <Box>
            <TextField
              id="task-name"
              label="Task name"
              fullWidth
              variant="standard"
              onChange={d => setNewScheduleName(d.currentTarget.value)}
              sx={{marginBottom: "1rem"}}
            />
            <FormControl fullWidth>
              <InputLabel id="hour-label">Hour</InputLabel>
              <Select
                fullWidth
                labelId="hour-label"
                id="hour-selection"
                value={newScheduleHour}
                label="Hour"
                onChange={event => setNewScheduleHour(event.target.value as string)}
                sx={{textAlign: "left"}}
              >
                {hourList.map((hour) => {
                  return <MenuItem value={hour} key={hour}>{hour}</MenuItem>
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

export default TimeBlock;