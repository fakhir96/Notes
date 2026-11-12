import dotenv from 'dotenv';
dotenv.config({path: "./.env", quiet: true})
// console.log("PK:", process.env.CLERK_PUBLISHABLE_KEY?.slice(0, 25));
// console.log("SK loaded:", !!process.env.CLERK_SECRET_KEY, process.env.CLERK_SECRET_KEY?.slice(0, 8));
import connectDB from './db/db.js';
import app from './app.js';


const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log("Server listening on port", PORT));
}

export default app;