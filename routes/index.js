import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { adminRefreshToken, lecturerRefreshToken, studentRefreshToken } from "../controllers/RefreshToken.js";
import { getLecturers, lecturerLogin, lecturerLogout, lecturerRegister } from "../controllers/Lecturers.js";
import { getStudents, studentLogin, studentLogout, studentRegister } from "../controllers/Students.js";
import { addProject, deleteProject, getProjects, getSingleProject, updateProject } from "../controllers/Projects.js";
import { addSubject, deleteSubject, getSingleSubject, getSubjects, updateSubject } from "../controllers/Subjects.js";
import { verifyImage } from "../middleware/VerifyImage.js";
import { addReviews, deleteReviews, getReviews, updateReviews } from "../controllers/Reviews.js";
import { getTeams, joinProjects } from "../controllers/Teams.js";

// import { addTeams, deleteTeams, getTeams, joinProjects, joinTeams, updateTeams } from "../controllers/Teams.js";
import { adminLogin, adminLogout, adminRegister, getAdmins } from "../controllers/Admin.js";

const router = express.Router();

// ADMIN ROUTER 
router.get('/api/admins', verifyToken, getAdmins);
router.post('/api/admins', adminRegister);
router.post('/api/login/admin', adminLogin);
router.get('/api/token/admin', adminRefreshToken);
router.delete('/api/logout/admin', adminLogout);

// STUDENT ROUTER
router.get('/api/students', verifyToken, getStudents);
router.post('/api/students', studentRegister);
router.post('/api/login/student', studentLogin);
router.get('/api/token/student', studentRefreshToken);
router.delete('/api/logout/student', studentLogout);

// LECTURER ROUTER
router.get('/api/lecturers', verifyToken, getLecturers);
router.post('/api/lecturers', lecturerRegister);
router.post('/api/login/lecturer', lecturerLogin);
router.get('/api/token/lecturer', lecturerRefreshToken);
router.delete('/api/logout/lecturer', lecturerLogout);

// PROJECT ROUTER 
router.get('/api/project', verifyToken, getProjects);
router.get('/api/project/:id', verifyToken, getSingleProject);
router.post('/api/project', verifyToken, addProject);
router.delete('/api/project/:id', verifyToken, deleteProject);
router.patch('/api/project/:id', verifyToken, updateProject);

// SUBJECT ROUTER
router.get('/api/subject', verifyToken, getSubjects);
router.get('/api/subject/:id', verifyToken, getSingleSubject);
router.post('/api/subject', verifyToken, addSubject);
router.delete('/api/subject/:id', verifyToken, deleteSubject);
router.patch('/api/subject/:id', verifyToken, updateSubject);

// REVIEWS ROUTER
router.get('/api/reviews', getReviews);
router.post('/api/reviews', verifyImage, addReviews);
// TO TEST 
router.delete('/api/reviews/:id', deleteReviews);
router.patch('/api/reviews/:id', verifyImage, updateReviews);
// Possible Feature : 
//  Filtering reviews by username
//  Rating


// TEAMS ROUTER
router.get('/api/project/teams', verifyToken, getTeams);
router.post('/api/project/teams', verifyToken, joinProjects);
// router.post('/api/teams/:uniqueCode', joinTeams);
// TO TEST
// router.delete('/api/teams/:id', deleteTeams);
// router.patch('/api/teams/:id', updateTeams);

// TASK ROUTER
// router.get('/task', verifyToken, getTask)
// router.post('/task', verifyToken, addTask)

export default router