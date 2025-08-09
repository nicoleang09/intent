import { Request, Response } from 'express';
import Task from './models/taskModel';
import User from './models/userModel';
import DayOfWeek from './constants/days';

export const getTasks = async (_: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching tasks');
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');
    const tasks = await Task.findAll({ where: { userId: user.get('id') } });
    const tasksWithDayString = tasks.map((task) => ({
      ...task.dataValues,
      day: DayOfWeek[task.dataValues.day],
    }));
    // const tasksWithDayString = tasks.map((task) => ({
    //   ...task.toJSON(),
    //   day: DayOfWeek[task.day],
    // }));
    res.status(200).json(tasksWithDayString);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching user tasks');
  }
};

export const getTasksByDay = async (req: Request, res: Response) => {
  try {
    const dayName = req.params.day;
    const dayEnum = DayOfWeek[dayName.toUpperCase() as keyof typeof DayOfWeek];
    if (dayEnum === undefined) return res.status(400).send('Invalid day');
    const tasks = await Task.findAll({ where: { day: dayEnum } });
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching tasks by day');
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const { title, day } = req.body;
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');
    const dayEnum = DayOfWeek[day.toUpperCase() as keyof typeof DayOfWeek];
    if (dayEnum === undefined) return res.status(400).send('Invalid day');
    const task = await Task.create({
      userId: user.get('id'),
      title,
      day: dayEnum,
      isCompleted: false,
    });
    res.status(200).json(task.id);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding task');
  }
};

export const deleteTasks = async (req: Request, res: Response) => {
  try {
    const tasks = req.body;
    for (const task of tasks) {
      await Task.destroy({ where: { id: task.id } });
    }
    res.status(200).send('Deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting tasks');
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await Task.destroy({ where: { id: req.params.taskId } });
    res.status(200).send('Deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting tasks');
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { updatedDay, updatedCompleted } = req.body;
    let updateData = {};
    if (updatedDay) {
      const dayEnum =
        DayOfWeek[updatedDay.toUpperCase() as keyof typeof DayOfWeek];
      if (dayEnum === undefined) return res.status(400).send('Invalid day');
      updateData = { ...updateData, day: dayEnum };
    }
    if (updatedCompleted !== undefined) {
      updateData = { ...updateData, isCompleted: updatedCompleted };
    }
    const [updatedRows, [updatedTask]] = await Task.update(updateData, {
      where: { id: taskId },
      returning: true,
    });
    if (updatedRows === 0) return res.status(404).send('Task not found');
    res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating task');
  }
};

// import pool from "./database.js";

// export const getTasks = (req: Request, res: Response) => {
//   pool.query("SELECT * FROM tasks ORDER BY id", (err, results) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     res.status(200).json(results.rows);
//   });
// };

// export const getTasksByUser = async (req: Request, res: Response) => {
//   console.log("getting task for user " + req.params.email);
//   const email = req.params.email;
//   const results = await pool.query(`SELECT id FROM users WHERE email = '${email}'`);
//   const userId = results.rows[0].id;

//   pool.query(`SELECT * FROM tasks WHERE id in
//     (SELECT task_id FROM usertasks WHERE user_id = '${userId}')`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows);
//     }
//   );
// };

// export const getTasksByDay = (req: Request, res: Response) => {
//   const dayName = req.params.day;
//   pool.query(`SELECT * FROM tasks WHERE day_id =
//     (SELECT id FROM days WHERE day='${dayName}')`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows);
//     }
//   );
// };

// export const addTask = async (req: Request, res: Response) => {
//   const { name, day } = req.body;
//   const email = req.params.email;
//   console.log(`email: ${email}`);

//   let results =  await pool.query(`SELECT id FROM days where day='${day}'`);
//   const dayId = results.rows[0].id;
//   results = await pool.query(`INSERT INTO tasks (name, completed, day_id) VALUES
//     ('${name}', False, ${dayId}) RETURNING id`);
//   const taskId = results.rows[0].id;
//   results = await pool.query(`SELECT id FROM users WHERE email='${email}'`);
//   const userId = results.rows[0].id;

//   pool.query(`INSERT INTO usertasks (user_id, task_id) VALUES
//     ('${userId}', ${taskId}) RETURNING id`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows[0].id);
//     }
//   );
// };

// export const deleteTasks = (req: Request, res: Response) => {
//   const tasks = req.body;
//   console.log(tasks);

//   for (const taskIdx in tasks) {
//     const taskId = tasks[taskIdx].id;

//     pool.query(`DELETE FROM tasks WHERE id=${taskId}`,
//       (err, results) => {
//         if (err) {
//           console.log(err);
//         }
//       }
//     );
//   }

//   res.status(200).send("Deleted");
// };

// export const updateTask = async (req: Request, res: Response) => {
//   const taskId = req.params.taskId;
//   const { updatedDay, updatedCompleted } = req.body;
//   let dayId;

//   if (updatedDay) {
//     let results =  await pool.query(`SELECT id FROM days where day='${updatedDay}'`);
//     dayId = results.rows[0].id;
//   }

//   // console.log(updatedDay, updatedCompleted);

//   const query = updatedDay && updatedCompleted != undefined
//     ? `UPDATE tasks SET day_id='${dayId}', completed='${updatedCompleted}' WHERE id='${taskId}'`
//     : updatedDay
//       ? `UPDATE tasks SET day_id='${dayId}' WHERE id='${taskId}'`
//       : updatedCompleted != undefined
//         ? `UPDATE tasks SET completed=${updatedCompleted} WHERE id='${taskId}'`
//         : "";

//   // console.log(query);

//   if (query === "") return;

//   pool.query(query,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows[0]);
//     }
//   );
// };
