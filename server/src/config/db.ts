import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('MongoDB is Connected Successfully')
    } catch (error) {
        console.log('Error in connecting to MongoDB', error)
        process.exit(1)
    }
}
