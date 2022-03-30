import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  // Get Header Authorization Token
  const authHeader = req.headers['authorization'];

  // Split by space because bearer auth got space
  const token = authHeader && authHeader.split(' ')[1];
  
  // Check Exist Token
  if(token == null) return res.sendStatus(401);

  // Verify Token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    console.log(decodedToken);
    if(err) return res.sendStatus(403);
    req.npm = decodedToken.npm;
    next();
  })
}