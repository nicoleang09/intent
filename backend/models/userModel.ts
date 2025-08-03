import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeDb from '../database';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  displayName?: string;
  isVerified?: boolean;
  role?: string;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'displayName' | 'role' | 'isVerified'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public displayName?: string;
  public isVerified?: boolean;
  public role?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  },
  {
    sequelize: sequelizeDb,
    modelName: 'User',
    timestamps: true,
  }
);

export default User;
