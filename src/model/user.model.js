const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 35
    },
    lastName: {
        type: String
    },
    mobileNumber: {
        type: String,
        minLength: 10,
        maxLength: 10,
        required: true,
        unique: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 36,
        required: true
    },
    gender: {
        type: String,
        default: "others",
        validate: {
            validator: (value) => {
                if (!["male", "female", "others"].includes(value)) {
                    return false;
                }
            },
            message: "Gender must be male, female, or others"
        },

    },
    age: {
        type: Number,
        default: 18,
        min: 18,
        max: 120
    },
    interests: {
        type: [String]
    },
    photoUrl: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    });

    userSchema.index({firstName : 1});

userSchema.pre('save', async function (next) {

    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error)
    }
})
userSchema.methods.validatePassword = async function (userPassword) {

    const isPasswordValid = await bcrypt.compare(userPassword, this.password);
    return isPasswordValid;
}
userSchema.methods.createJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, process.env.MERGE_DEV_JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
}


const User = model("user", userSchema);
module.exports = User;