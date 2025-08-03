import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {
  getTasks,
  getTasksByDay,
  addTask,
  deleteTasks,
  getTasksByUser,
  updateTask,
} from './weekly-planner-controller';
import {
  getSchedules,
  getSchedulesByHour,
  addSchedule,
  deleteSchedules,
  getSchedulesByUser,
  updateSchedule,
} from './time-block-controller';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getCookie } from './user-controller';
import sequelizeDb from './database';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const originUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://intentapp.netlify.app'
    : 'http://localhost:3000';

const corsOptions = {
  origin: originUrl,
  credentials: true,
  optionSuccessStatus: 200,
};

// Init DB connection
const startServer = async () => {
  try {
    await sequelizeDb.authenticate();
    console.log('Connection established successfully.');

    // Sync all models
    await sequelizeDb.sync({ alter: true });
    console.log('Models synchronized.');

    //   app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

startServer();

app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json('Hello world!');
});

app.get('/getcookie', getCookie);

// app.post("/users", addGuestUser);

// Weekly Agenda APIs
app.get('/usertasks/:email', getTasksByUser);
app.post('/usertasks/:email', addTask);
app.get('/tasks', getTasks);
app.delete('/tasks', deleteTasks);
app.post('/tasks/:taskId', updateTask);
app.get('/tasks/:day', getTasksByDay);

// Time Block APIs
app.get('/userschedules/:email', getSchedulesByUser);
app.post('/userschedules/:email', addSchedule);
app.get('/schedules', getSchedules);
app.delete('/schedules', deleteSchedules);
app.post('/schedules/:scheduleId', updateSchedule);
app.get('/schedules/:hour', getSchedulesByHour);

app.listen(port, () => {
  console.log(`Backend listening on on port ${port}.`);
});

export default app;
