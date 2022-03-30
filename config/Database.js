import { Sequelize } from "sequelize";

const db = new Sequelize('project_management_system', 'root', '', {
  host: "localhost",
  dialect: "mysql"
})

export default db;