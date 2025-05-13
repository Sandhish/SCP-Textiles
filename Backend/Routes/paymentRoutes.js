import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { Customer } from '../Models/Customer.model.js';
import { Order } from '../Models/Order.model.js';
import { Cart } from '../Models/Cart.model.js';
import { adminMiddleware } from '../Middleware/adminMiddleware.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { shippingDetails, paymentIntentId, amount } = req.body;
        const customerId = req.user._id;

        const cartItems = await Cart.find({ customer: customerId }).populate({
            path: 'product',
            select: 'name price _id'
        });


        if (!cartItems) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const productsForOrder = cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const order = new Order({
            customer: customerId,
            products: productsForOrder,
            shippingDetails,
            totalAmount: amount,
            paymentIntentId,
            paymentStatus: 'paid'
        });

        order.orderNumber = `OD${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        await order.save();

        const productIds = cartItems.map(item => item.product._id);

        await Customer.findByIdAndUpdate(
            customerId,
            {
                $push: { purchasedProduts: { $each: productIds } },
            }
        );

        await Cart.deleteMany({ customer: customerId });

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order.orderNumber
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});
router.get('/all-orders', adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product',
                select: 'name image price'
            });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});
router.post('/update-order-status', adminMiddleware, async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log('Order ID:', orderId);
        console.log('Status:', status);
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status }
        );
        console.log('Updated Order:', order);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate({
                path: 'products.product',
                select: 'name image price'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

router.get('/:orderNumber', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber,
            customer: req.user._id
        }).populate({
            path: 'products.product',
            select: 'name image price'
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

router.get('/success/:orderNumber', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber,
            customer: req.user._id
        }).select('orderNumber shippingDetails totalAmount createdAt');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            metadata: {
                customerId: req.user._id.toString(),
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
});

router.post('/update-purchase-history', authMiddleware, async (req, res) => {
    try {
        const { paymentIntent, shippingDetails } = req.body;

        const intent = await stripe.paymentIntents.retrieve(paymentIntent);

        if (intent.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        res.status(200).json({ message: 'Purchase history updated successfully' });
    } catch (error) {
        console.error('Error updating purchase history:', error.message, error.stack);
        res.status(500).json({ message: 'Error updating purchase history', error: error.message });
    }
});

export default router;