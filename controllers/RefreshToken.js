import jwt from "jsonwebtoken";
import Admins from "../models/AdminModel.js";
import Lecturers from "../models/LecturerModel.js";
import Students from "../models/StudentModel.js";

export const studentRefreshToken = async(req, res) => {
  try {
    // Get Refresh Token From User Cookies
    const refreshToken = req.cookies.refreshToken;
    
    // Check Exist Token
    if(!refreshToken) return res.sendStatus(401);

    const student = await Students.findAll({
      where: {
        refresh_token: refreshToken
      }
    });
    
    // Refresh Token doesn't match with the existing one in database
    if(!student[0]) return res.sendStatus(403)

    // JWT Verify Refresh Token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decodedToken) => {
      console.log(decodedToken);
      if(error) return res.sendStatus(403);
      const studentId = student[0].id;
      const studentName = student[0].name;
      const studentNpm = student[0].npm;
      const studentEmail = student[0].email;
      const accessToken = jwt.sign({studentId, studentName, studentNpm, studentEmail}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });
      res.json({ accessToken })
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
}

export const lecturerRefreshToken = async(req, res) => {
  try {
    // Get Refresh Token From User Cookies
    const refreshToken = req.cookies.refreshToken;
    
    // Check Exist Token
    if(!refreshToken) return res.sendStatus(401);

    const lecturer = await Lecturers.findAll({
      where: {
        refresh_token: refreshToken
      }
    });
    
    // Refresh Token doesn't match with the existing one in database
    if(!lecturer[0]) return res.sendStatus(403)

    // JWT Verify Refresh Token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decodedToken) => {
      console.log(decodedToken);
      if(error) return res.sendStatus(403);
      const lecturerId = lecturer[0].id;
      const lecturerName = lecturer[0].name;
      const lecturerNidn = lecturer[0].nidn;
      const lecturerEmail = lecturer[0].email;
      const accessToken = jwt.sign({lecturerId, lecturerName, lecturerNidn, lecturerEmail}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });
      res.json({ accessToken })
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
}

export const adminRefreshToken = async(req, res) => {
  try {
    // Get Refresh Token From User Cookies
    const refreshToken = req.cookies.refreshToken;
    
    // Check Exist Token
    if(!refreshToken) return res.sendStatus(401);

    const admin = await Admins.findAll({
      where: {
        refresh_token: refreshToken
      }
    });
    
    // Refresh Token doesn't match with the existing one in database
    if(!admin[0]) return res.sendStatus(403)

    // JWT Verify Refresh Token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decodedToken) => {
      console.log(decodedToken);
      if(error) return res.sendStatus(403);
      const adminId = admin[0].id;
      const adminName = admin[0].name;
      const adminEmail = admin[0].email;
      const accessToken = jwt.sign({adminId, adminName, adminEmail}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });
      res.json({ accessToken })
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
}