import { apiUrl, hourList } from "./Utils";
import { TaskMap } from "./Types";

const hours = hourList;

export const scheduleData = {
  h0700: [],
  h0800: [],
  h0900: [],
  h1000: [],
  h1100: [],
  h1200: [],
  h1300: [],
  h1400: [],
  h1500: [],
  h1600: [],
  h1700: [],
  h1800: [],
  h1900: [],
  h2000: [],
  h2100: [],
  h2200: [],
  h2300: [],
};

export const getAllSchedules = async (username: string) => {
  let schedules:TaskMap = {};

  const res = await fetch(apiUrl + "/userschedules/" + username);
  const allSchedules = await res.json();

  hours.forEach((hour) => {
    hour = "h" + hour;
    schedules[hour] = [];
  });

  for (let schedule in allSchedules) {
    allSchedules[schedule].id = allSchedules[schedule].id.toString();
    let hourName = "h" + allSchedules[schedule].hour;
    // console.log(hourName);
    schedules[hourName].push(allSchedules[schedule]);
  }

  return schedules;
}