import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { Image } from "../models/image.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import  Jwt  from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false}); // it will not ask for validation before saving refresh token and also it is not necessary
        return {refreshToken,accessToken};
    }
    catch(error){
        throw new ApiError(404 , "Something went Wrong while Generating Access and refresh token!!");
    }
}


const registerUser = asyncHandler(async(req, res) => {
    // get user detail from frontend
    const { fullName, email, username, password } = req.body;
    console.log("email:", email)
        //   validation - not empty 
    if (fullName === "" || email === "" || username === "" || password === "") {
        throw new ApiError(400, "All Fields Are required")
    }
    // check if user already exist 
    const existedUser = await User.findOne({
        $or: [{ email: email }, { username: username }] // it will find the user with same email and same username
    })
    if (existedUser) {
        throw new ApiError(409, "User with email and username Already Existed")

    }
    console.log(req)
    console.log("Files are:",req.files);  // this method will be provided by middleware multur  
    // check for image - avatar
    let avatarLocalPath,coverImageLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatarLocalPath=req.files.avatar[0].path;
    }

    // console.log(avatarLocalPath);
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    // console.log(coverImageLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image Required !!")
    }
    // upload avatar in cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath); // it tooks time so that's why we used await
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log(avatar);
    if (!avatar) {
        throw new ApiError(400, "Avatar Image Required !!")
    }
    // create user object and make create user entry in database
    const user=await User.create({
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage ?.url || "",
        email: email,
        password: password,
        username: username.toLowerCase()
    });
    const createdUserWithoutPasswordAndRefreshToken=await User.findById(user._id).select("-password -refreshToken");
    if(!createdUserWithoutPasswordAndRefreshToken){
        throw new ApiError(500,"Something Went Wrong while Registering User")
    }
 
    return res.status(201).json(
     new ApiResponse(200,createdUserWithoutPasswordAndRefreshToken,"User Registered Successfully")
        )
});

const loginUser=asyncHandler(async (req,res)=>{
//  req.body ->data
const {username,password}=req.body;
console.log(username,"and",password)
// username or email
if(!username || !password){
    throw new ApiError(400,"Username and Password both required for login !!")
}
// finding the user with given username
const userAvailable=await User.findOne({
    $or:[{username}] // it will find users in basis of same username 
})
if(!userAvailable){
    throw new ApiError(404,"User doesn't Exist !!");
}
// check the password 
const isPasswordValid=await userAvailable.isPasswordCorrect(password); // make sure this is not mongoose model "User" , this is our user instance because these methods are for our user instances
if(!isPasswordValid){
    throw new ApiError(401,"Enter Correct Password")
}

// access and refresh token
const {accessToken,refreshToken}=await generateAccessAndRefreshToken(userAvailable._id); // this function will deal with database so it can take time that's why we used await

// we send these tokens in secure cookies
const loggedInUser=await User.findById(userAvailable._id).select("-password -refreshToken");
const options={
    
    httpOnly:true,
    sameSite:'None',
    secure:true,  // it should be true only in production not in development
    
}  // iske bad cookies ko hm kvl server se modify kr payge frontend se nahi
console.log("loggedIn user:",loggedInUser)
res.cookie("accessToken",accessToken,options);
res.cookie("refreshToken",refreshToken,options)
// console.log("Cookies:",res.cookie);
return res.status(200).json(new ApiResponse(200,{User:loggedInUser,accessToken,refreshToken},"User Logged in Successfully!!"))

});



// what is cookies 
// Cookies are small pieces of text sent to your browser by a website you visit. They help that website remember information about your visit



const logoutUser=asyncHandler(async (req,res)=>{
    console.log("logging out");
User.findByIdAndUpdate(req.userAddedInReq._id,{
    $set:{
        refreshToken:undefined
    },
}, 
{
    new:true // after this we'll get refreshToken as true
})
const options={
    httpOnly:true,
    secure:true,
    sameSite:'None' // most important line
} 
console.log("logging out");
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,"User Logged out Succesfully!!"))
})


const refreshAccessToken = asyncHandler(async (req,res)=>{
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
    throw new ApiError(404,"Unauthorized Error ")
}
const decodedToken=Jwt.verify(incomingRefreshToken,process.env.ACCESS_TOKEN_SECRET);
if(!decodedToken){
    throw new ApiError(404,"Invalid Refresh Token");
}
const user=await User.findById(decodedToken?._id);
if(!user){
    throw new ApiError(401,"Invalid Refresh Token");
}
if(user.refreshToken!==incomingRefreshToken){
    throw new ApiError(401,"Refresh Token is Expired");
}
const options={ 
    httpOnly:true,
    secure:true,
} 
const {newRefreshToken,newAccessToken}=await generateAccessAndRefreshToken(user._id);
res.status(200).cookie("accessToken",newAccessToken,options).cookie("refreshToken",newRefreshToken,options).json(new ApiResponse(200,"Access Token Refreshed"))
})



const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.params.id)
    // console.log("User is :",user);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req,res)=>{
    console.log("hello");
    console.log("Request:",req)
    console.log("Request Cookies:",req.cookies)
    const user=await User.findById(req.userAddedInReq?._id);
    if(!user){
        throw new ApiError(404,"No Current User Exists !!");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Current User fetched successfully"))
})


const updateAccountDetail = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body;
    const userId= req.params.id;
    if(!fullName || !email){
        throw new ApiError(400,"All Fiels are Required");
    }
    const user=await User.findByIdAndUpdate(userId,{
        $set:{
            fullName:fullName,
            email:email
        }
    },
    {
        new:true
    }).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200,user,"Account Details Updated Successfully"));
})


const updateUserAvatar = asyncHandler(async(req,res)=>{
    // console.log("Request Files:",req.file)  // req.files will be given by multur
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(404,"Avatar Image is missing!!");
    }
    // console.log("Local Path Avatar :",avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(404,"Avatar Image can't Uploaded in Cloud !!")
    }
  
    const user= await User.findByIdAndUpdate(req.params.id,{
        $set:{
            avatar:avatar.url
        }
    },{
        new:true
    })
    return res.status(200).json(new ApiResponse(200,user,"Avatar Updated Successfully"));

})



const updateCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(404,"Cover Image is missing!!");
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(404,"Cover Image can't Uploaded in Cloud !!")
    }
  
    const user= await User.findByIdAndUpdate(req.params.id,{
        $set:{
            coverImage:coverImage.url
        }
    },{
        new:true
    })
    return res.status(200).json(new ApiResponse(200,user,"CoverImage Updated Successfully"));

})



const uploadImage = asyncHandler(async(req,res)=>{
   const imageLocalPath = req.file?.path;
   if (!imageLocalPath) {
    throw new ApiError(404,"Image is Missing !!")
   }
   const CloudImage =await uploadOnCloudinary(imageLocalPath);
   if(!CloudImage){
    throw new ApiError(404,"Image can't Uploaded in Cloud !!")
    }
 const currUser = req.userAddedInReq;
 if(!currUser){
    throw new ApiError(404,"Unauthorized User!!")
 }
 const {title,description}=req.body;
//  console.log("Image",req.file)
 console.log("Title:",title ,"Description:",description);
 const uploadedImage = await Image.create({
    image:CloudImage.url,
    title:title,
    description:description,
    owner:currUser
 });

  // Customize toJSON method to exclude circular references
  const userJSON = currUser.toJSON();
  userJSON.gallery = userJSON.gallery.map((image) => ({
       
             // Exclude circular reference
  }));

  
console.log("Uploaded Image:",uploadedImage);
currUser.gallery.push(uploadedImage);
await currUser.save({validateBeforeSave:false})
 res.status(200).json(new ApiResponse(200,uploadedImage,"Image Uploaded in Gallery Successfully!!"))
})


// function to return the gallery images array of current user
const getGalleryImages = asyncHandler(async (req, res) => {
    const userId = req.userAddedInReq._id; // Assuming _id is the user ID field
    // console.log("User Before Populate:",req.userAddedInReq);
    try {
        const user = await User.findById(userId).populate('gallery');//The term "populate" in the context of Mongoose and MongoDB refers to the act of replacing references (typically ObjectId references) in a document with the actual documents those references point to. 
        // console.log("User:",user)
        // Access the populated gallery array
        const gallery = user.gallery;
        // Now 'gallery' contains the Image documents with details
        res.status(200).json(new ApiResponse(200,gallery,"Gallery Images fetched Succesfully !! "));
    } catch (err) {
        // Handle error
        res.status(500).json({ error: err.message });
    }
});

const deleteImageFromUserGallery = asyncHandler(async(req,res)=>{
const imageId= req.params.id;
try {
    // Find the image by ID and remove it from the database
    const deletedImage = await Image.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove the reference to the image from the gallery array of the user who owns the image
    await User.updateOne({ gallery: imageId }, { $pull: { gallery: imageId } });

    // Respond with success message
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
export { registerUser , deleteImageFromUserGallery, loginUser , logoutUser ,refreshAccessToken , changeCurrentPassword , getCurrentUser,updateAccountDetail,updateUserAvatar,updateCoverImage,uploadImage,getGalleryImages}