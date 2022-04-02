import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Students = db.define(
  "students",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    npm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Students;