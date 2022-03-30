import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { lecturerRefreshToken, studentRefreshToken } from "../controllers/RefreshToken.js";
import { getLecturers, lecturerLogin, lecturerLogout, lecturerRegister } from "../controllers/Lecturers.js";
import { getStudents, studentLogin, studentLogout, studentRegister } from "../controllers/Students.js";
import { addProject, deleteProject, getProjects, getSingleProject, updateProject } from "../controllers/Projects.js";
import { addSubject, deleteSubject, getSingleSubject, getSubjects, updateSubject } from "../controllers/Subjects.js";
import { verifyImage } from "../middleware/VerifyImage.js";
import { addReviews, deleteReviews, getReviews, updateReviews } from "../controllers/Reviews.js";
import { addTeams, deleteTeams, getTeams, joinTeams, updateTeams } from "../controllers/Teams.js";

const router = express.Router();

// STUDENT ROUTER
router.get('/students', verifyToken, getStudents);
router.post('/students', studentRegister);
router.post('/login/student', studentLogin);
router.get('/token/student', studentRefreshToken);
router.delete('/logout/student', studentLogout);

// LECTURER ROUTER
router.get('/lecturers', verifyToken, getLecturers);
router.post('/lecturers', lecturerRegister);
router.post('/login/lecturer', lecturerLogin);
router.get('/token/lecturer', lecturerRefreshToken);
router.delete('/logout/lecturer', lecturerLogout);

// PROJECT ROUTER 
router.get('/project', verifyToken ,getProjects);
router.get('/project/:id', getSingleProject);
router.post('/project', addProject);
router.delete('/project/:id', deleteProject);
router.patch('/project/:id', updateProject);

// SUBJECT ROUTER
router.get('/subject', getSubjects);
router.get('/subject/:id', getSingleSubject);
router.post('/subject', addSubject);
router.delete('/subject/:id', deleteSubject);
router.patch('/subject/:id', updateSubject);

// REVIEWS ROUTER
router.get('/reviews', getReviews);
router.post('/reviews', verifyImage, addReviews);
// TO TEST 
router.delete('/reviews/:id', deleteReviews);
router.patch('/reviews/:id', verifyImage, updateReviews);
// Possible Feature : 
//  Filtering reviews by username
//  Rating


// TEAMS ROUTER
router.get('/teams', getTeams);
router.post('/teams', addTeams);
router.post('/teams/:uniqueCode', joinTeams);
// TO TEST
router.delete('/teams/:id', deleteTeams);
router.patch('/teams/:id', updateTeams);

// TASK ROUTER
// router.get('/task', verifyToken, getTask)
// router.post('/task', verifyToken, addTask)

export default router