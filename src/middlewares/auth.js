const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");
const userAuth =async (req, res, next)=>{
  try {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error : true, statusCode : 401, message: "Unauthorized Access, Please login to continue"});
    }
    const decoded=await jwt.verify(token, 'M@nu123HN');
    const {_id} =decoded;
    const user = await UserModel.findById(_id);
    if(!user){
        throw new Error("Unauthorized Access, User Not Found");
    };

    req.user=user;
    next();
    
  } catch (error) {
    res.status(400).json({error : true, statusCode : 400, message: "Error "+error.message});
  }
}

module.exports={
    userAuth
}