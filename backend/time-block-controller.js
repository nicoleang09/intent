import pool from "./database.js";

export const getSchedules = (req, res) => {
  pool.query("SELECT * FROM schedules ORDER BY id", (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    res.status(200).json(results.rows);
  });
};

export const getSchedulesByUser = async (req, res) => {
  console.log("getting schedule for user " + req.params.username);
  const username = req.params.username;
  const results = await pool.query(`SELECT id FROM users WHERE username = '${username}'`);
  const userId = results.rows[0].id;

  pool.query(`SELECT * FROM schedules WHERE id in
    (SELECT schedule_id FROM userschedules WHERE user_id = '${userId}')`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows);
    }
  );
};

export const getSchedulesByHour = (req, res) => {
  const hourName = req.params.hour;
  pool.query(`SELECT * FROM schedules WHERE hour='${hourName}'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows);
    }
  );
};

export const addSchedule = async (req, res) => {
  const { name, hour } = req.body;
  const username = req.params.username;
  console.log(`username: ${username}`);
  
  let results = await pool.query(`INSERT INTO schedules (name, completed, hour) VALUES
    ('${name}', False, '${hour}') RETURNING id`);
  const scheduleId = results.rows[0].id;
  results = await pool.query(`SELECT id FROM users WHERE username='${username}'`);
  const userId = results.rows[0].id;
  
  pool.query(`INSERT INTO userschedules (user_id, schedule_id) VALUES
    ('${userId}', ${scheduleId}) RETURNING id`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows[0].id);
    }
  );
};

export const deleteSchedules = (req, res) => {
  const schedules = req.body;
  console.log(schedules);

  for (const scheduleIdx in schedules) {
    const scheduleId = schedules[scheduleIdx].id;
    
    pool.query(`DELETE FROM schedule WHERE id=${scheduleId}`,
      (err, results) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  res.status(200).send("Deleted");
};

export const updateSchedule = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const { updatedHour, updatedCompleted } = req.body;

  // console.log(updatedHour, updatedCompleted);

  const query = updatedHour && updatedCompleted != undefined
    ? `UPDATE schedules SET hour='${updatedHour}', completed='${updatedCompleted}' WHERE id='${scheduleId}'`
    : updatedHour
      ? `UPDATE schedules SET hour='${updatedHour}' WHERE id='${scheduleId}'`
      : updatedCompleted != undefined
        ? `UPDATE schedules SET completed=${updatedCompleted} WHERE id='${scheduleId}'`
        : "";
  
  // console.log(query);

  if (query === "") return;
  
  pool.query(query,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows[0]);
    }
  );
};