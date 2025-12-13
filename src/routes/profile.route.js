
const express=require("express");
const {getProfilesFeed, getUserProfile, updateUserProfile} = require("../controller/profile.controller");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, getUserProfile);
profileRouter.get("/feed",userAuth, getProfilesFeed);
profileRouter.patch("/profile/edit",userAuth, updateUserProfile);


module.exports=profileRouter;
