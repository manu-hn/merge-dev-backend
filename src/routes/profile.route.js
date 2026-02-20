
const express=require("express");
const {getProfilesFeed, getUserProfile, updateUserProfile} = require("../controller/profile.controller");
const { userAuth } = require("../middlewares/auth");
const upload = require("../utils/multer-config");

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, getUserProfile);
profileRouter.get("/feed",userAuth, getProfilesFeed);
profileRouter.patch("/profile/edit",userAuth,upload.single("photo"), updateUserProfile);


module.exports=profileRouter;
