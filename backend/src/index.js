import connectDB from "./db/DB_Connection.js";
import { app } from "./app.js";
// import express from express;
import dotenv from "dotenv"; // we are importing the dotenv in 'import' form not in 'require' form because we used "type": "module" in package.json file
// dotenv.config({ path: "./env" });
dotenv.config(); // we need to configure dotenv file because we need to distribute all environment variable over the files 
connectDB() // async function will return promise so that's why we used .then().catch() here
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(` ⚙️  Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => { console.log("MongoDB Connection Failed !! ", error); })