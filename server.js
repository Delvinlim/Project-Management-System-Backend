import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Students from "./models/StudentModel.js";
import Lecturers from "./models/LecturerModel.js";
import Projects from "./models/ProjectModel.js";
import Subjects from "./models/SubjectModel.js";
import Teams from "./models/TeamModel.js";
import Reviews from "./models/ReviewModel.js";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database connected....");
  // await Projects.sync({force: true});
  // await Subjects.sync({force: true});
  // await Students.sync({force: true});
  // await Lecturers.sync({force: true});
  // await Reviews.sync({force: true});
  // await Teams.sync({force: true});
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use('/reviews', express.static("./resources/static/assets/uploads/"))

app.listen(5000, () => console.log("Server running at port 5000"));
