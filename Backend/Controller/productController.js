import Product from "../Models/Product.model.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getImageLink = async (file) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "uploads", resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        console.log("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            uploadStream.end(file.buffer);
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProducts = async (req, res) => {
    try {
        const { tag } = req.query;

        const query = tag ? { tag } : {};

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createProduct = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Please upload a file" });
    }

    try {
        const imageLink = await getImageLink(file);

        const product = await Product.create({
            image: imageLink,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            tag: req.body.tag,
        });

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.quantity = req.body.quantity || product.quantity;
        product.description = req.body.description || product.description;
        product.tag = req.body.tag || product.tag;

        if (req.body.image) {
            product.image = req.body.image;
        }

        await product.save();
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const uploadProductImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imageLink = await getImageLink(file);

        res.json({ imageUrl: imageLink });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};