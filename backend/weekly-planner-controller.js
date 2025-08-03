import pool from "./database.js";

export const getTasks = (req, res) => {
  pool.query("SELECT * FROM tasks ORDER BY id", (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    res.status(200).json(results.rows);
  });
};

export const getTasksByUser = async (req, res) => {
  console.log("getting task for user " + req.params.username);
  const username = req.params.username;
  const results = await pool.query(`SELECT id FROM users WHERE username = '${username}'`);
  const userId = results.rows[0].id;

  pool.query(`SELECT * FROM tasks WHERE id in
    (SELECT task_id FROM usertasks WHERE user_id = '${userId}')`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows);
    }
  );
};

export const getTasksByDay = (req, res) => {
  const dayName = req.params.day;
  pool.query(`SELECT * FROM tasks WHERE day_id =
    (SELECT id FROM days WHERE day='${dayName}')`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows);
    }
  );
};

export const addTask = async (req, res) => {
  const { name, day } = req.body;
  const username = req.params.username;
  console.log(`username: ${username}`);
  
  let results =  await pool.query(`SELECT id FROM days where day='${day}'`);
  const dayId = results.rows[0].id;
  results = await pool.query(`INSERT INTO tasks (name, completed, day_id) VALUES
    ('${name}', False, ${dayId}) RETURNING id`);
  const taskId = results.rows[0].id;
  results = await pool.query(`SELECT id FROM users WHERE username='${username}'`);
  const userId = results.rows[0].id;
  
  pool.query(`INSERT INTO usertasks (user_id, task_id) VALUES
    ('${userId}', ${taskId}) RETURNING id`,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200).json(results.rows[0].id);
    }
  );
};

export const deleteTasks = (req, res) => {
  const tasks = req.body;
  console.log(tasks);

  for (const taskIdx in tasks) {
    const taskId = tasks[taskIdx].id;
    
    pool.query(`DELETE FROM tasks WHERE id=${taskId}`,
      (err, results) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  res.status(200).send("Deleted");
};

export const updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { updatedDay, updatedCompleted } = req.body;
  let dayId;
  
  if (updatedDay) {
    let results =  await pool.query(`SELECT id FROM days where day='${updatedDay}'`);
    dayId = results.rows[0].id;
  }

  // console.log(updatedDay, updatedCompleted);

  const query = updatedDay && updatedCompleted != undefined
    ? `UPDATE tasks SET day_id='${dayId}', completed='${updatedCompleted}' WHERE id='${taskId}'`
    : updatedDay
      ? `UPDATE tasks SET day_id='${dayId}' WHERE id='${taskId}'`
      : updatedCompleted != undefined
        ? `UPDATE tasks SET completed=${updatedCompleted} WHERE id='${taskId}'`
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