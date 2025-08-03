import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeDb from '../database';
import DayOfWeek from '../constants/days';
import User from './userModel';

interface TaskAttributes {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  day: DayOfWeek;
  dueDate?: Date;
}

interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'id' | 'description' | 'isCompleted'> {}

class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public userId!: number;
  public title!: string;
  public description?: string;
  public isCompleted?: boolean;
  public day!: DayOfWeek;
  public dueDate?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
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
    day: {
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
    modelName: 'Task',
    timestamps: true,
  }
);

export default Task;
