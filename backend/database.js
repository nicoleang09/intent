import pg from "pg";
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: "localhost",
//   database: "api",
//   password: process.env.DB_PASS,
//   port: 5432,
// });
const pool = process.env.NODE_ENV === "production"
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@`
        + `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
    });

export default pool;