const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {sendConectionRequest, acceptConnectionRequest, fetchAllReceivedRequests,
     fetchAllAcceptedConnections, fetchUserFeed} = require("../controller/request.controller");

const requestRouter= express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, sendConectionRequest);
requestRouter.post("/request/review/:status/:requestId", userAuth, acceptConnectionRequest);
requestRouter.get("/user/requests/received", userAuth,fetchAllReceivedRequests );
requestRouter.get("/user/connections",userAuth,fetchAllAcceptedConnections);
requestRouter.get("/user/feed", userAuth, fetchUserFeed);


module.exports= requestRouter;