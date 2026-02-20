const UserModel = require("../model/user.model");
const {validateUserDataForUpdate} = require("../utils/helper");

const getProfilesFeed =async (req, res) => {
  try {
  
    const feed = await UserModel.find();
    res.status(200).json({ feed });
  } catch (error) {
    throw new Error("Register Failed ", + error.message);

  }
}

const getUserProfile =async (req, res) => {
  try {
    const user = req.user;  
    const {password, ...rest} = user._doc;
    res.status(200).json({ message: "Profile Fetched Successfully",data : rest });

  } catch (error) {
    throw new Error("ERROR FAILED ", + error.message);
  }
}

const updateUserProfile = async (req, res)=>{
  
  try {

    const isUpdateAllowed  = validateUserDataForUpdate(req, res);
  
    if(!isUpdateAllowed){
        throw new Error("Update Failed : Invalid User Data")
    }
    const user = req.user;
    const updatedData = req.body;
      let photoUrl;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;  // Safe access
    }
// only update if image exists
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {...updatedData, ...(photoUrl && { photoUrl }), }, {new : true});
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json({error : false, message : "Profile Updated Successfully", data : rest});
    
  } catch (error) {
    res.status(400).json({error : true, message : `Error While Updating : ${error.message}`})
  }
}


module.exports={
    getProfilesFeed,
    getUserProfile,
    updateUserProfile
}