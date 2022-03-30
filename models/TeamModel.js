import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Projects from "./ProjectModel.js";
import Students from "./StudentModel.js";

const { DataTypes } = Sequelize;

const Teams = db.define(
  "project_teams",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uniqueCode: {
      type: DataTypes.STRING,
    allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Students.belongsToMany(Projects, {
  through: "project_teams",
  foreignKey: "studentId",
});

Projects.belongsToMany(Students, {
  through: "project_teams",
  foreignKey: "projectId",
});

export default Teams;
