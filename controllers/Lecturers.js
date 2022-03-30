import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Lecturers from "../models/LecturerModel.js";

export const getLecturers = async (req, res) => {
  try {
    const lecturer = await Lecturers.findAll({
      attributes:['id', 'name', 'nidn', 'email', 'phone', 'gender']
    });
    res.json(lecturer);
  } catch (error) {
    console.log(error);
  }
};

export const lecturerRegister = async (req, res) => {
  // Destruct Request Body
  const { name, nidn, email, gender, phone, password, confirmPassword } = req.body;

  // Validate Password & Confirm Password
  if(password !== confirmPassword) return res.status(400).json({message: "Confirm Password didn't match with Password"});
  
  // Hash User Password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // Create Data
    await Lecturers.create({
      'name': name,
      'nidn': nidn,
      'email': email,
      'gender': gender,
      'phone': phone,
      'password': hashPassword
    });
    res.json({message: "Successfully registered"})
  } catch (error) {
    console.log(error);
  }
};

export const lecturerLogin = async(req, res) => {
  try {
    const lecturer = await Lecturers.findAll({
      where: {
        nidn: req.body.nidn
      }
    });
    // Validate Password
    console.log(lecturer)
    console.log(req.body)
    // console.log(res)
    const matchPassword = await bcrypt.compare(req.body.password, lecturer[0].password);
    if(!matchPassword) return res.status(400).json({message: "Wrong Password"});

    // Generate Access & Refresh Token with lecturer Id, Name, Nidn, Email for the JWT Payload
    const lecturerId = lecturer[0].id;
    const lecturerName = lecturer[0].name;
    const lecturerNidn = lecturer[0].nidn;
    const lecturerEmail = lecturer[0].email;
    const accessToken = jwt.sign({lecturerId, lecturerName, lecturerNidn, lecturerEmail}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s'
    })
    const refreshToken = jwt.sign({lecturerId, lecturerName, lecturerNidn, lecturerEmail}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })
    
    // Save Refresh Token
    await Lecturers.update({refresh_token: refreshToken}, {
      where: {
        id: lecturerId
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
    res.status(404).json({message: "Nidn not registered"})
  }
}

export const lecturerLogout = async(req, res) => {
      // Get Refresh Token From User Cookies
      const refreshToken = req.cookies.refreshToken;
    
      // Check Exist Token
      if(!refreshToken) return res.sendStatus(204);
  
      const lecturer = await Lecturers.findAll({
        where: {
          refresh_token: refreshToken
        }
      });
      
      // Refresh Token doesn't match with the existing one in database
      if(!lecturer[0]) return res.sendStatus(204)

      const lecturerId = lecturer[0].id
      // Set Null value into Refresh Token at database
      await Lecturers.update({refresh_token: null}, {
        where: { 
          id: lecturerId
        }
      });
      // Clear Cookie
      res.clearCookie('refreshToken');
      return res.sendStatus(200);
}