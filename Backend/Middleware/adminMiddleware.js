import { verifyToken } from "../Utils/jwtToken.js";
export const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.scpToken;
        console.log(token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = verifyToken(token);
        console.log(payload);

        if (payload.user.userType !== "admin") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}