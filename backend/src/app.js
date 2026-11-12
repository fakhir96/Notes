import express from 'express';
import cors from 'cors'
import connectDB from "./db/db.js";
import noteRoutes from './routes/notes.route.js'
import { errorHandler } from './middlewares/error.middleware.js';
import { clerkMiddleware } from '@clerk/express';

const app = express()
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json())
app.use(clerkMiddleware())

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/v1", noteRoutes)
  

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler)

export default app;