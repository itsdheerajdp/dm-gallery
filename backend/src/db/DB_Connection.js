import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// we should always use async - await function for database connection because sometimes our database took time during connection as it can be in another sub continent
// also use try catch for error handling also during database connection
const connectDB = async function() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error :", error);
        process.exit(1); // forcefully terminate the process
    }
}
export default connectDB;