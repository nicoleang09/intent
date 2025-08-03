import pool from "./database.js";

export const getCookie = async (req, res) => {
  const cookie = JSON.parse(JSON.stringify(req.cookies)).guestUsername;
  // console.log(cookie);

  if (!cookie || Object.keys(cookie).length === 0) {
    // console.log("no cookie...");
    const getGuestUsername = addGuestUser();
    const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;

    getGuestUsername.then((queryRes) => {
      const guestUsername = queryRes.rows[0].username;
      res.cookie("guestUsername", guestUsername, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: tenYears,
      });
      // console.log(guestUsername);
      res.status(200).json(guestUsername);
    });
  } else {
    // console.log("cookie alr exists: " + cookie);
    res.status(200).json(cookie);
  }
};

const addGuestUser = async () => {
  let prevId = await pool.query(`SELECT max(id) FROM users`);
  // console.log(prevId);
  let guestIdNum = prevId.rows[0].max + 1;
  let guestId = "guest" + guestIdNum;
  
  return pool.query(`INSERT INTO users (username, password) VALUES
    ('${guestId}', '') RETURNING username`);
};