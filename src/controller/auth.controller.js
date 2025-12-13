const { validateUserData } = require("../utils/helper");
const UserModel = require("../model/user.model");



const registerUser = async (req, res) => {

  try {
    const isValid = validateUserData(req.body, res);

    if (!isValid) {
      res.status(400).json({ message: "Invalid User Data" });
      return;
    }
    const existingUser = await UserModel.findOne({ $or: [{ emailId: req.body.emailId }, { mobileNumber: req.body.mobileNumber }] });
    if (existingUser) {
      res.status(400).json({ error: true, statusCode: 400, message: "User with given emailId or mobileNumber already exists" });
      return;
    }

    const { firstName, lastName, password, emailId, mobileNumber, gender, age, interests } = req?.body;


    const user = new UserModel({ firstName, lastName, password, emailId, mobileNumber, gender, age, interests });
    await user.save();
    const { password: passwordHash, ...rest } = user._doc
    res.status(201).json({ success: true, erroe: false, statusCode: 201, message: "User Registered Successfully", data: rest });
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



const loginRouter = async (req, res) => {
  try {

    const { emailId, password } = req.body;
    const isUserExists = await UserModel.findOne({ emailId });
    if (!isUserExists) {
      throw new Error("Invalid Credentials");
    }
    const token = await isUserExists.createJWT();
    const isPasswordValid = await isUserExists.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");

    }
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict', expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    res.status(200).json({ error: false, statusCode: 200, message: "Login Successfull" });
    return;

  } catch (error) {
    res.status(401).json({ error: true, statusCode: 500, message: "Login Failed " + error.message });
    return;
  }
}

const logoutUser = async (req, res) => {
  res.cookie('token', null, { httpOnly: true, secure: true, sameSite: 'Strict', expires: new Date(0) });

  res.status(200).json({ error: false, message: "Logout Successfull" })
}
const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    await UserModel.findByIdAndDelete(user?._id)
    res.status(200).json({ error: false, message: "User Deleted Successfully!" })
  } catch (error) {
    // throw new Error("Not Authorized ", error.message)
    res.status(401).json({ error: true, message: "Not Authorized " + error.message })
  }
}

const resetUserPassword = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      throw new Error("User Not Found ")
      // const { emailId } = req.body;
      // const isUserExists = await UserModel.findOne({ emailId });
      // if (!isUserExists) {
      //   throw new Error("User Not Found Provide Email")
      // }
      // isUserExists.password = req.body.newPassword;
      // await isUserExists.save();
      // res.status(200).json({ error: false, message: "Password Reset Successfully" })
      // return;
    }
    const { newPassword, password } = req.body;
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Current Password")
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ error: false, message: "Password Reset Successfully" })

  } catch (error) {
    res.status(400).json({ error: true, message: "Password Reset Failed " + error.message })
  }
}

const resetPasswordWithEmail = async (req, res)=>{
  try {
    
  } catch (error) {
    res.status(400).json({error : true, message : "Password Reset Failed "+ error.message})
  }
}

module.exports = { registerUser, loginRouter, deleteUser, logoutUser, resetUserPassword, resetPasswordWithEmail };