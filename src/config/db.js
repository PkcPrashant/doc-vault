import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
    return await mongoose.connect(env.mongoUri);
}

export const disconnectDB = async () => {
    return await mongoose.disconnect();
}
