import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Projects from "./ProjectModel.js";

const { DataTypes } = Sequelize;

const Reviews = db.define(
  "reviews",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    // profileImageType: {
    //   type: DataTypes.STRING,
    // },
    // profileImageName: {
    //   type: DataTypes.STRING,
    // },
    // profileImageData: {
    //   type: DataTypes.BLOB("long"),
    // },
  },
  {
    freezeTableName: true,
  }
);
export default Reviews;
