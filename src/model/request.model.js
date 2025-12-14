const { model, Schema } = require("mongoose")

const connectionRequestSchema = new Schema({
    fromUserId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', "accepted", "rejected"],
            message: `{VALUE} is not supported`
        }
    },
}, { timestamps: true });

// connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // Prevent users from sending connection requests to themselves
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }

    next();
})

const ConnectionRequestModel = model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;