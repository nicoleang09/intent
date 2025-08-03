import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelizeDb: Sequelize;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  sequelizeDb = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelizeDb = new Sequelize(
    process.env.POSTGRES_DB || '',
    process.env.POSTGRES_USER || '',
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      logging: false,
    }
  );
}

export default sequelizeDb;
