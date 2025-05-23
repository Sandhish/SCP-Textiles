import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Atlas_URL, {
        })
        console.log("MongoDB connection SUCCESS");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
export default connectDB;