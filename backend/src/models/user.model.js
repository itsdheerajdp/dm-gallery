import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true // if we want to enable searching in any field of database then it will optimise searching
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverImage: {
        type: String
    },
    gallery: [{
        type: mongoose.Schema.ObjectId,
        ref: "Image"
    }],
    password: {
        type: String,
        required: [true, "Password is required!"]

    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})



// pre middleware will be executed just before storing the data into database
// so we'll encrypt the password of user and then store it into database , for this we'll use pre 
// when we call "save" method then it executes the callback function given just before saving data into database
UserSchema.pre("save", async function(next) { // use async function because sometimes middlewares took more time     // don't use arrow function as callback here because in arrow function we don't have current context of object (this) and we need to track current context of object so we can't use arrow function here
        if (!this.isModified("password")) return next(); // agar password modify kiya jay tbhi hm password ko hash krege otherwise agar hm ye condition na lagay to pure object me koi bhi change krne par password bar bar hash hoga jo ki ek problem create krega
        this.password = await bcrypt.hash(this.password, 10); // second parameter is number of rounds in hashing 
    }) // The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware



UserSchema.methods.isPasswordCorrect = async function(password) {
        return await bcrypt.compare(password, this.password);
    } // this method will return true if entered password(normal password) by user and stored hashed password of that user is same


UserSchema.methods.generateAccessToken = function() {
    return Jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        } // payload (modern name of data)
        , process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function() {
    return Jwt.sign({
            _id: this._id,
        } // payload (modern name of data)
        , process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", UserSchema);