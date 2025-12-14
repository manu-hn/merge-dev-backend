const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {sendConectionRequest, acceptConnectionRequest, fetchAllReceivedRequests, fetchAllAcceptedConnections} = require("../controller/request.controller");

const requestRouter= express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, sendConectionRequest);
requestRouter.post("/request/review/:status/:requestId", userAuth, acceptConnectionRequest);
requestRouter.get("/user/requests/received", userAuth,fetchAllReceivedRequests );
requestRouter.get("/user/connections",userAuth,fetchAllAcceptedConnections)


module.exports= requestRouter;