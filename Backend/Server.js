import express from 'express';
import connectDB from './Config/connnectDB.js';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/authRoutes", authRoutes);
app.use("/api/productRoutes", productRoutes);

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})