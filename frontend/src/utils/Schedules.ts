import { apiUrl, hourList } from './Utils';
import { TaskMap } from './Types';
import { getSessionUsername } from './session-storage';

const hours = hourList;

export const createScheduleData = () => {
  const scheduleData: TaskMap = {};
  hourList.forEach((hour) => (scheduleData[`h${hour}`] = []));
  return scheduleData;
};

export const getAllSchedules = async (username: string) => {
  let schedules: TaskMap = {};

  const res = await fetch(apiUrl + '/userschedules/' + username);
  const allSchedules = await res.json();

  hours.forEach((hour) => {
    hour = 'h' + hour;
    schedules[hour] = [];
  });

  for (let schedule in allSchedules) {
    allSchedules[schedule].id = allSchedules[schedule].id.toString();
    let hourName = allSchedules[schedule].hour.toLowerCase();
    schedules[hourName].push(allSchedules[schedule]);
  }

  return schedules;
};

export const addSchedule = async (name: string, hour: string) => {
  const data = { title: name, hour: hour };

  await fetch(apiUrl + '/userschedules/' + getSessionUsername(), {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      hour: 'h' + data.hour,
    }),
  });
};

export const updateScheduleCompleted = (taskId: number, completed: boolean) => {
  const data = {
    updatedCompleted: completed,
  };

  fetch(apiUrl + '/schedules/' + taskId, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteSchedule = (taskId: number) => {
  fetch(apiUrl + '/schedules/' + taskId, {
    method: 'DELETE',
    mode: 'cors',
  });
};
