const UserModel = require("../model/user.model");
const ConnectionRequestModel = require("../model/request.model");

const USER_SAFE_DATA = "firstName lastName emailId gender age interests photoUrl";
const sendConectionRequest = async (req, res,) => {
    try {
        // The User ID of the sender is obtained from the authenticated user (req.user)
        const fromUserId = req.user?._id;
        // The User ID of the recipient and the status are obtained from the request parameters
        const toUserId = req.params?.toUserId;
        // The status is obtained from the request parameters
        const status = req.params?.status; // 'interested' or 'ignored'

        // Check if the recipient / received user exists
        const toUser = await UserModel.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User Not Found" })
        };

        // Check if a connection request already exists between the two users
        const isConnectionRequestExists = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        // If a connection request already exists, return an error response
        if (isConnectionRequestExists) {
            return res.status(400).json({ message: "Connection Request Already Exists" })
        }

        // Create a new connection request
        const newConnectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        // Save the connection request to the database 
        await newConnectionRequest.save();

        const message = status === "interested" ? "Connection Request Sent Successfully" : "User Ignored Successfully";

        res.status(200).json({ success: true, message:`${message}`, data: newConnectionRequest })

    } catch (error) {
        res.status(400).json({ message: "Error While Sending Connection Request", error: error.message })
    }
}

const acceptConnectionRequest = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];

        // Check if the status is valid
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status" })
        }

        // Check if the connection request exists and is directed to the logged-in user and status is 'interested' 
        // Check if the loggedInUser has a connection request with the given requestId and status 'interested' 
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser?._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request Not Found" })
        }

        // Update the status of the connection request
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({ success: true, message: `Connection Request ${status} Successfully`, data: data })

    } catch (error) {
        res.status(400).json({ message: "Error While Accepting Connection Request", error: error.message })
    }
}

const fetchAllReceivedRequests = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser?._id,
            status: "interested",
        })
            .populate("fromUserId", USER_SAFE_DATA);
        // .populate("fromUserId", ["firstName", "lastName", "gender", "age", "interests", "photoUrl"]);


        res.status(200).json({ success: true, data: receivedRequests })

    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error: error.message })
    }
}

const fetchAllAcceptedConnections = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const userConnections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser?._id, status: "accepted" },
                { toUserId: loggedInUser?._id, status: "accepted" }
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = userConnections.map((row) => {
            if (row?.fromUserId?._id.toString() === loggedInUser?._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.status(200).json({ success: true, message: "Connection Fected Successfully!", data })
    }
    catch (error) {
        res.status(400).json({ message: "Something Went Wrong", error: error.message })
    }
}


const fetchUserFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
         limit = limit > 100 ? 100 : limit;
        const skip = (page - 1) * limit;
        // const connectionRequests = await ConnectionRequestModel.find({
        //     $or : [{fromuserId : loggedInUser._id}, {toUserId : loggedInUser._id}]
        // })
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        // select function filteres out the fields provided and returns only those fields values
        const hiddenUserProfileCards = new Set();
        // Filtering out unique user ID - fromUserId and toUserId from connectionRequests
        // and adding them to hiddenUserProfileCards set
        // because user should not see profiles of users with whom they have already interacted
        connectionRequests.forEach((connection) => {
            hiddenUserProfileCards.add(connection.fromUserId.toString());
            hiddenUserProfileCards.add(connection.toUserId.toString());
        });
        const userFeed = await UserModel.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUserProfileCards) } }, // Exclude users with whom there is already a connection request
                { _id: { $ne: loggedInUser._id } } // Exclude logged-in user's own profile
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit); // Pagination using skip and limit

        res.status(200).json({ success: true, data: userFeed })


    } catch (error) {
        res.status(400).json({ message: "Error : " + error.message })
    }
}
module.exports = {
    sendConectionRequest,
    acceptConnectionRequest,
    fetchAllReceivedRequests,
    fetchAllAcceptedConnections,
    fetchUserFeed
}