import db from '@src/database/models';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

export type TCreateUserInput = {} & Optional<TUser, 'id'>;
export type TUpdateUserInput = Partial<TCreateUserInput>;

class User extends Model<TUser, TCreateUserInput> implements TUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: typeof db) {
    // Example: User has many Expenses
    User.hasMany(models.Expense, { foreignKey: 'userId', as: 'expenses' });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new dataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new dataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      password: {
        type: new dataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    },
  );

  return User;
};
