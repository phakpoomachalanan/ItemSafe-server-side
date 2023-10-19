import mongoose from "mongoose"
import { logger } from "../util/logger.js"

export async function connectDb() {
    try {
        const mongoUri  = process.env.MONGODB_URI
        await mongoose.connect(mongoUri)
        logger.info(`Database Connected at ${mongoUri}`)
    } catch (error) {
        logger.error("Can't Connect to Database")
    }
}