const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {sendConectionRequest, acceptConnectionRequest, fetchAllReceivedRequests} = require("../controller/request.controller");

const requestRouter= express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, sendConectionRequest);
requestRouter.post("/request/review/:status/:requestId", userAuth, acceptConnectionRequest);
requestRouter.get("/user/requests/received", userAuth,fetchAllReceivedRequests )


module.exports= requestRouter;