import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeDb from '../database';
import User from './userModel';
import { Hours } from '../constants/hours';

interface ScheduleAttributes {
  id?: number;
  userId: number;
  taskId?: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  hour: Hours;
  dueDate?: Date;
}

interface ScheduleCreationAttributes
  extends Optional<ScheduleAttributes, 'id' | 'description' | 'isCompleted'> {}

class Schedule
  extends Model<ScheduleAttributes, ScheduleCreationAttributes>
  implements ScheduleAttributes
{
  public id!: number;
  public userId!: number;
  public taskId?: number;
  public title!: string;
  public description?: string;
  public isCompleted?: boolean;
  public hour!: Hours;
  public dueDate?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Schedule.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hour: {
      type: DataTypes.INTEGER, // Store enum as integer
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeDb,
    modelName: 'Schedule',
    timestamps: true,
  }
);

export default Schedule;
