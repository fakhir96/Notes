import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("DB connected");
         
    } catch (error) {
        console.log("DB connection error", error)
        process.exit(1)
    }
}

export {connectDB};