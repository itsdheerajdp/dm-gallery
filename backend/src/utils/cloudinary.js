import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"; // file system

cloudinary.config({
    cloud_name: "dheerajbackend",
    api_key: "994218117875869",
    api_secret: "AXBes7pm6IEcl6YXni-RT1B3ohU"
}); // pasted from cloudinary.com


const uploadOnCloudinary = async(localFilePath) => {
    try {
        if (!localFilePath) return null
            //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file has been uploaded successfull
            //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("ERROR IS:", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
export { uploadOnCloudinary }