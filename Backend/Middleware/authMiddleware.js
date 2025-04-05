import { verifyToken } from "../Utils/jwtToken.js";
import { Customer } from "../Models/Customer.model.js";
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.scpToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = verifyToken(token);
        const user = await Customer.findById(payload.user.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}