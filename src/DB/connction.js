import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export const connectDB = ()=>{
    mongoose.connect(process.env.DB_HOST).then(()=>{
        console.log("Connected to db successfully");
    }).catch((err)=>{
        console.log("failed to connect db", err)
    })
}