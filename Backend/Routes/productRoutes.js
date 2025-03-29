import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../Controller/productController.js';
import { addToCart, getCart, removeFromCart, clearCart, updateCart, addToWishlist, getWishlist, removeFromWishlist } from '../Controller/cartController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { adminMiddleware } from '../Middleware/adminMiddleware.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const productRoutes = express.Router();
productRoutes.get('/products', getProducts);
productRoutes.get('/product/:id', getProductById);
productRoutes.post('/product/create', adminMiddleware, upload.single("image"), createProduct);
productRoutes.put('/product/update/:id', adminMiddleware, updateProduct);
productRoutes.delete('/product/delete/:id', adminMiddleware, deleteProduct);
productRoutes.post('/cart/add', authMiddleware, addToCart);
productRoutes.get('/cart', authMiddleware, getCart);
productRoutes.delete('/cart/remove/:id', authMiddleware, removeFromCart);
productRoutes.delete('/cart/clear', authMiddleware, clearCart);
productRoutes.put('/cart/update/:id', authMiddleware, updateCart);
productRoutes.post('/wishlist/add', authMiddleware, addToWishlist);
productRoutes.get('/wishlist', authMiddleware, getWishlist);
productRoutes.delete('/wishlist/remove/:id', authMiddleware, removeFromWishlist);
export default productRoutes;

