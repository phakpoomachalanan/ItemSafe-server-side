import mongoose from "mongoose";
import { logger } from "../util/logger.js"

export async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        logger.info("Database Connected Successfully")
    } catch (e) {
        logger.error("Can't Connect to Database")
    }
}