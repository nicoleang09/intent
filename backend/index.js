import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getTasks, getTasksByDay, addTask, deleteTasks, getTasksByUser, updateTask } from './weekly-planner-controller.js';
import { getSchedules, getSchedulesByHour, addSchedule, deleteSchedules, getSchedulesByUser, updateSchedule } from './time-block-controller.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getCookie } from './user-controller.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const originUrl = process.env.NODE_ENV === "production"
  ? "https://life-dashboard.netlify.app"
  : "http://localhost:3000";

const corsOptions = {
  origin: originUrl, 
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.get("/getcookie", getCookie);

// app.post("/users", addGuestUser);

// Weekly Agenda APIs
app.get("/usertasks/:username", getTasksByUser);
app.post("/usertasks/:username", addTask);
app.get("/tasks", getTasks);
app.delete("/tasks", deleteTasks);
app.post("/tasks/:taskId", updateTask);
app.get("/tasks/:day", getTasksByDay);

// Time Block APIs
app.get("/userschedules/:username", getSchedulesByUser);
app.post("/userschedules/:username", addSchedule);
app.get("/schedules", getSchedules);
app.delete("/schedules", deleteSchedules);
app.post("/schedules/:scheduleId", updateSchedule);
app.get("/schedules/:hour", getSchedulesByHour);

app.listen(port, () => {
  console.log(`Backend listening on on port ${port}.`)
});

export default app;