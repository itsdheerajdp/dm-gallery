import { Router } from "express";
import { changeCurrentPassword, deleteImageFromUserGallery, getCurrentUser, getGalleryImages, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetail, updateCoverImage, updateUserAvatar, uploadImage } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js"
import { jwtVerify } from "../middleware/auth.middleware.js";
import multer from "multer";
const router = Router();
router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser)
router.route("/login").post(loginUser);
//secured route
router.route("/logout").post(jwtVerify, logoutUser); // jwtVerify is the middleware which will add the current user as the attribute in request parameter object and by using that object we'll do logout operation
export default router
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password/:id").post(changeCurrentPassword) // jwtVerify is the middleware which will add the current user as the attribute in request parameter object and by using that object we'll do changePassword operation
router.route("/current-user-page").get(jwtVerify, getCurrentUser)
router.route("/current-user-page/current-user-detail").get(jwtVerify, getCurrentUser)
router.route("/update-avatar").post(jwtVerify, upload.single("avatar"), updateUserAvatar); // we are using two middlewares here .. first we'll authorise the user and then use multur to store image in local storage and then send image in cloudinary
router.route("/update-cover-image").post(jwtVerify, upload.single("coverImage"), updateCoverImage);
router.route("/upload-image").post(jwtVerify,upload.single("image"),uploadImage);
router.route("/delete-image/:id").delete(jwtVerify,deleteImageFromUserGallery)
router.route("/get-gallery-images").get(jwtVerify,getGalleryImages)
router.route("/update-account-details/:id").post(updateAccountDetail);
router.route("/update-avatar/:id").post(upload.single("avatar"),updateUserAvatar);
router.route("/update-coverImage/:id").post(upload.single("coverImage"),updateCoverImage);
// middleware in routes
// router.route("/ENDPOINT").post(firstmiddleware,anothermiddleware,anothermiddleware,mainfunction); we'll use middleware just before the main function of the router and next() will call the next middleware , and then next middleware and finally the main function of the route