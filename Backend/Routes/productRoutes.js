import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, addReview, uploadProductImage } from '../Controller/productController.js';
import { addToCart, getCart, removeFromCart, clearCart, updateCart, addToWishlist, getWishlist, removeFromWishlist } from '../Controller/cartController.js';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon } from '../Controller/couponController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { adminMiddleware } from '../Middleware/adminMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.post('/product/create', adminMiddleware, upload.single("image"), createProduct);
router.put('/product/update/:id', adminMiddleware, updateProduct);
router.delete('/product/delete/:id', adminMiddleware, deleteProduct);
router.post('/product/upload-image/:id', adminMiddleware, upload.single("image"), uploadProductImage);
router.post('/review', authMiddleware, addReview);

router.post('/cart/add', authMiddleware, addToCart);
router.get('/cart', authMiddleware, getCart);
router.delete('/cart/remove/:id', authMiddleware, removeFromCart);
router.delete('/cart/clear', authMiddleware, clearCart);
router.put('/cart/update/:id', authMiddleware, updateCart);

router.post('/wishlist/add', authMiddleware, addToWishlist);
router.get('/wishlist', authMiddleware, getWishlist);
router.delete('/wishlist/remove/:id', authMiddleware, removeFromWishlist);

router.post('/coupon/create', adminMiddleware, createCoupon);
router.get('/coupons', getCoupons);
router.get('/coupon/:id', getCouponById);
router.put('/coupon/update/:id', adminMiddleware, updateCoupon);
router.delete('/coupon/delete/:id', adminMiddleware, deleteCoupon);
router.post('/coupon/validate', validateCoupon);

export default router;