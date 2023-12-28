import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const jwtVerify = asyncHandler(async(req, res, next) => {
    try {
        // console.log("request:",req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("Token:",token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.userAddedInReq = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})