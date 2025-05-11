import express from 'express';
import connectDB from './Config/connnectDB.js';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import paymentRoutes from './Routes/paymentRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: ["http://localhost:5173", "https://scp-textiles.vercel.app"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/authRoutes", authRoutes);
app.use("/api/productRoutes", productRoutes);
app.use("/api/payment", paymentRoutes);

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})