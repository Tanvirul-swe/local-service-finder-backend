import db from '@src/database/models';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

type ExpenseAttributes = {
  id: number;
  title: string;
  amount: number;
  userId: number;
};

type ExpenseCreationAttributes = {} & Optional<ExpenseAttributes, 'id'>;

class Expense
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  public id!: number;
  public title!: string;
  public amount!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: typeof db) {
    // An expense belongs to a user
    Expense.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Expense.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: new dataTypes.STRING(128),
        allowNull: false,
      },
      amount: {
        type: dataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'expenses',
      modelName: 'Expense',
    },
  );

  return Expense;
};
