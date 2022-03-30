import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Projects from "./ProjectModel.js";

const { DataTypes } = Sequelize;

const Subjects = db.define(
  "subjects",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
  }
);

Subjects.hasOne(Projects);
// Lecturers.hasOne(Subjects);
export default Subjects;
