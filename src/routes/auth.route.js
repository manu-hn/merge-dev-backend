const express = require('express');
const {loginRouter, registerUser, deleteUser, logoutUser, resetUserPassword, resetPasswordWithEmail} = require("../controller/auth.controller");
const { userAuth } = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post("/login",loginRouter);
authRouter.post("/register", registerUser);
authRouter.post("/logout/user", logoutUser);
authRouter.patch("/auth/reset-password", userAuth, resetUserPassword);
authRouter.patch("/auth/reset-password-by-email",  resetPasswordWithEmail);



authRouter.delete("/delete/user", userAuth, deleteUser)
module.exports= authRouter;

