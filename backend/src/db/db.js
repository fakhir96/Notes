import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.DATABASE_URL, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null; // allow a retry on the next request
        throw err;
    }
    return cached.conn;
};

export default connectDB;