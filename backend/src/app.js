import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
// use method will be used for middlewares and configurations
app.use(cors({
    origin: ['http://127.0.0.1:5173','https://dm-gallery.netlify.app','https://dm-gallery.netlify.com'] ,
    // origin: ['https://dm-gallery.netlify.app'] ,
    credentials: true,

}));
// app.use(cors()) // allowing all the origins
// below are the major configurations
app.use(express.json({ limit: "16kb" })); // using json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // when we send data in our url then we encode that data in the url(imagin if we search "dheraj singh" in google then it will encode space into '+' then send this data into url)
app.use(express.static("public")); // this configuration will be used when we wanted to store some images or files in our server itself then we make a folder(here name of the folder is public) to store these files
app.use(cookieParser()); // to manage cookies inside our application



// routes
import userRouter from "./routes/user.routes.js"; // because of export default(only one object will be exported in export default) we can give anyname 

app.use("/api/v1/users", userRouter)
export { app };