import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Subjects from "./SubjectModel.js";

const { DataTypes } = Sequelize;

const Lecturers = db.define(
  "lecturers",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nidn: {
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

Lecturers.hasOne(Subjects);

export default Lecturers;