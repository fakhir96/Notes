// export const requireUser = (req, res, next) => {
//     const { userId } = getAuth(req);
//     if (!userId) throw new ApiError(401, "Unauthorized");
//     req.userId = userId;
//     next();
// };

import { getAuth } from "@clerk/express";
import { verifyToken } from "@clerk/backend";
import { ApiError } from "../utils/ApiError.js";

export const requireUser = async (req, res, next) => {
    const auth = getAuth(req);

    if (!auth.userId) {
        const token = req.headers.authorization?.replace("Bearer ", "");
        try {
            const result = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });
            console.log("verifyToken result:", result);
        } catch (err) {
            console.log("verifyToken failed:", err.reason, "-", err.message);
        }
        return next(new ApiError(401, "Unauthorized"));
    }

    req.userId = auth.userId;
    next();
};