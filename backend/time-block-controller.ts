import { Request, Response } from 'express';
import Schedule from './models/scheduleModel';
import User from './models/userModel';
import { Hours } from './constants/hours';

// Get all schedules
export const getSchedules = async (_: Request, res: Response) => {
  try {
    const schedules = await Schedule.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(schedules);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching schedules');
  }
};

// Get schedules by user
export const getSchedulesByUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');
    const schedules = await Schedule.findAll({
      where: { userId: user.get('id') },
    });
    const schedulesWithDayString = schedules.map((schedule) => ({
      ...schedule.dataValues,
      hour: Hours[schedule.dataValues.hour],
    }));
    res.status(200).json(schedulesWithDayString);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching user schedules');
  }
};

// Get schedules by hour
export const getSchedulesByHour = async (req: Request, res: Response) => {
  try {
    const hourName = req.params.hour;

    const hourEnum = Hours[hourName.toUpperCase() as keyof typeof Hours];
    if (hourEnum === undefined) return res.status(400).send('Invalid hour');

    const schedules = await Schedule.findAll({ where: { hour: hourEnum } });
    res.status(200).json(schedules);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching schedules by hour');
  }
};

// Add a schedule
export const addSchedule = async (req: Request, res: Response) => {
  try {
    const { title, hour } = req.body;
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send('User not found');

    const hourEnum = Hours[hour.toUpperCase() as keyof typeof Hours];
    if (hourEnum === undefined) return res.status(400).send('Invalid hour');

    const schedule = await Schedule.create({
      userId: user.get('id'),
      title,
      hour: hourEnum,
      isCompleted: false,
    });
    res.status(200).json(schedule.id);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding schedule');
  }
};

// Delete schedules
export const deleteSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = req.body;
    for (const schedule of schedules) {
      await Schedule.destroy({ where: { id: schedule.id } });
    }
    res.status(200).send('Deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting schedules');
  }
};

// Delete a schedule
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    await Schedule.destroy({ where: { id: req.params.scheduleId } });
    res.status(200).send('Deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting schedules');
  }
};

// Update a schedule
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const scheduleId = req.params.scheduleId;
    const { updatedHour, updatedCompleted } = req.body;
    const updateData: any = {};

    if (updatedHour) {
      const hourEnum = Hours[updatedHour.toUpperCase() as keyof typeof Hours];
      if (hourEnum === undefined) return res.status(400).send('Invalid hour');

      updateData.hour = hourEnum;
    }
    if (updatedCompleted !== undefined)
      updateData.isCompleted = updatedCompleted;
    const [updatedRows, [updatedSchedule]] = await Schedule.update(updateData, {
      where: { id: scheduleId },
      returning: true,
    });
    if (updatedRows === 0) return res.status(404).send('Schedule not found');
    res.status(200).json(updatedSchedule);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating schedule');
  }
};

// import pool from './database.js';

// export const getSchedules = (req: Request, res: Response) => {
//   pool.query('SELECT * FROM schedules ORDER BY id', (err, results) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     res.status(200).json(results.rows);
//   });
// };

// export const getSchedulesByUser = async (req: Request, res: Response) => {
//   console.log('getting schedule for user ' + req.params.username);
//   const username = req.params.username;
//   const results = await pool.query(
//     `SELECT id FROM users WHERE username = '${username}'`
//   );
//   const userId = results.rows[0].id;

//   pool.query(
//     `SELECT * FROM schedules WHERE id in
//     (SELECT schedule_id FROM userschedules WHERE user_id = '${userId}')`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows);
//     }
//   );
// };

// export const getSchedulesByHour = (req: Request, res: Response) => {
//   const hourName = req.params.hour;
//   pool.query(
//     `SELECT * FROM schedules WHERE hour='${hourName}'`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows);
//     }
//   );
// };

// export const addSchedule = async (req: Request, res: Response) => {
//   const { name, hour } = req.body;
//   const username = req.params.username;
//   console.log(`username: ${username}`);

//   let results =
//     await pool.query(`INSERT INTO schedules (name, completed, hour) VALUES
//     ('${name}', False, '${hour}') RETURNING id`);
//   const scheduleId = results.rows[0].id;
//   results = await pool.query(
//     `SELECT id FROM users WHERE username='${username}'`
//   );
//   const userId = results.rows[0].id;

//   pool.query(
//     `INSERT INTO userschedules (user_id, schedule_id) VALUES
//     ('${userId}', ${scheduleId}) RETURNING id`,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       res.status(200).json(results.rows[0].id);
//     }
//   );
// };

// export const deleteSchedules = (req: Request, res: Response) => {
//   const schedules = req.body;
//   console.log(schedules);

//   for (const scheduleIdx in schedules) {
//     const scheduleId = schedules[scheduleIdx].id;

//     pool.query(
//       `DELETE FROM schedule WHERE id=${scheduleId}`,
//       (err, results) => {
//         if (err) {
//           console.log(err);
//         }
//       }
//     );
//   }

//   res.status(200).send('Deleted');
// };

// export const updateSchedule = async (req: Request, res: Response) => {
//   const scheduleId = req.params.scheduleId;
//   const { updatedHour, updatedCompleted } = req.body;

//   // console.log(updatedHour, updatedCompleted);

//   const query =
//     updatedHour && updatedCompleted != undefined
//       ? `UPDATE schedules SET hour='${updatedHour}', completed='${updatedCompleted}' WHERE id='${scheduleId}'`
//       : updatedHour
//       ? `UPDATE schedules SET hour='${updatedHour}' WHERE id='${scheduleId}'`
//       : updatedCompleted != undefined
//       ? `UPDATE schedules SET completed=${updatedCompleted} WHERE id='${scheduleId}'`
//       : '';

//   // console.log(query);

//   if (query === '') return;

//   pool.query(query, (err, results) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     res.status(200).json(results.rows[0]);
//   });
// };
