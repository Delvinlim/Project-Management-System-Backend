import bcrypt from "bcrypt";
import Students from "../models/StudentModel.js";
import jwt from "jsonwebtoken";
import Admins from "../models/AdminModel.js";

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admins.findAll({
      attributes:['id', 'name', 'npm', 'email', 'phone', 'gender']
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const adminRegister = async (req, res) => {
  // Destruct Request Body
  const { name, email, gender, phone, password, confirmPassword } = req.body;
  if(!name || !email || !gender || !phone || !password || !confirmPassword) return res.sendStatus(400)

  // Validate Password & Confirm Password
  if(password !== confirmPassword) return res.status(400).json({message: "Confirm Password didn't match with Password"});
  
  // Hash User Password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  
  try {
    // Search Existing Admin Email
    const admin = await Admins.findAll({
      where: {
        email: email
      }
    })
    console.log(admin)
    if(admin[0]) return res.status(409).json({message: "Email already registered"})

    // Create Data
    await Admins.create({
      'name': name,
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

export const adminLogin = async(req, res) => {
  if(!req.body.email) return res.sendStatus(400);
  
  try {
    const admin = await Admins.findAll({
      where: {
        email: req.body.email
      }
    });
    // Validate Password
    const matchPassword = await bcrypt.compare(req.body.password, admin[0].password);
    if(!matchPassword) return res.status(400).json({message: "Wrong Password"});

    // Generate Access & Refresh Token with Student Id, Name, Npm, Email for the JWT Payload
    const adminId = admin[0].id;
    const adminName = admin[0].name;
    const adminEmail = admin[0].email;
    const accessToken = jwt.sign({adminId, adminName, adminEmail}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s'
    })
    const refreshToken = jwt.sign({adminId, adminName, adminEmail}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })
    
    // Save Refresh Token
    await Admins.update({refresh_token: refreshToken}, {
      where: {
        id: adminId
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
    res.status(404).json({message: "User not registered"})
  }
}

export const adminLogout = async(req, res) => {
      // Get Refresh Token From User Cookies
      const refreshToken = req.cookies.refreshToken;
    
      // Check Exist Token
      if(!refreshToken) return res.sendStatus(204);
  
      const admin = await Admins.findAll({
        where: {
          refresh_token: refreshToken
        }
      });
      
      // Refresh Token doesn't match with the existing one in database
      if(!admin[0]) return res.sendStatus(204)

      const adminId = admin[0].id
      // Set Null value into Refresh Token at database
      await Admins.update({refresh_token: null}, {
        where: { 
          id: adminId
        }
      });
      // Clear Cookie
      res.clearCookie('refreshToken');
      return res.sendStatus(200);
}