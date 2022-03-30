import bcrypt from "bcrypt";
import Students from "../models/StudentModel.js";
import jwt from "jsonwebtoken";

export const getStudents = async (req, res) => {
  try {
    const students = await Students.findAll({
      attributes:['id', 'name', 'npm', 'email', 'phone', 'gender']
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const studentRegister = async (req, res) => {
  // Destruct Request Body
  const { name, npm, email, gender, phone, password, confirmPassword } = req.body;

  // Validate Password & Confirm Password
  if(password !== confirmPassword) return res.status(400).json({message: "Confirm Password didn't match with Password"});
  
  // Hash User Password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // Create Data
    await Students.create({
      'name': name,
      'npm': npm,
      'email': email,
      'gender': gender,
      'phone': phone,
      'password': hashPassword
    });
    res.json({message: "Successfully registered"})
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const studentLogin = async(req, res) => {
  try {
    console.log(req.body)
    const student = await Students.findAll({
      where: {
        npm: req.body.npm
      }
    });
    // Validate Password
    const matchPassword = await bcrypt.compare(req.body.password, student[0].password);
    if(!matchPassword) return res.status(400).json({message: "Wrong Password"});

    // Generate Access & Refresh Token with Student Id, Name, Npm, Email for the JWT Payload
    const studentId = student[0].id;
    const studentName = student[0].name;
    const studentNpm = student[0].npm;
    const studentEmail = student[0].email;
    const accessToken = jwt.sign({studentId, studentName, studentNpm, studentEmail}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s'
    })
    const refreshToken = jwt.sign({studentId, studentName, studentNpm, studentEmail}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })
    
    // Save Refresh Token
    console.log(studentId, 'see here id');
    await Students.update({refresh_token: refreshToken}, {
      where: {
        id: studentId
      }
    });

    // Send to client HTTP Cookie Only & Access Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true // If use https
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(404).json({message: "Npm not registered"})
  }
}

export const studentLogout = async(req, res) => {
      // Get Refresh Token From User Cookies
      const refreshToken = req.cookies.refreshToken;
    
      // Check Exist Token
      if(!refreshToken) return res.sendStatus(204);
  
      const student = await Students.findAll({
        where: {
          refresh_token: refreshToken
        }
      });
      
      // Refresh Token doesn't match with the existing one in database
      if(!student[0]) return res.sendStatus(204)

      const studentId = student[0].id
      // Set Null value into Refresh Token at database
      await Students.update({refresh_token: null}, {
        where: { 
          id: studentId
        }
      });
      // Clear Cookie
      res.clearCookie('refreshToken');
      return res.sendStatus(200);
}