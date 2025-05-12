import { Cart } from "../Models/Cart.model.js";
// import { Product } from "../Models/Product.model.js";
// import { Customer } from "../Models/Customer.model.js";
import Wishlist from "../Models/Wishlist.model.js";
export const addToCart = async (req, res) => {
    try {
        console.log(req.user._id);
        console.log(req.body);
        const { product, quantity } = req.body;
        const customer = req.user._id;
        const cart = await Cart.findOne({ product, customer });
        if (cart) {
            cart.quantity += quantity;
            await cart.save();
            return res.json(cart);
        }
        const newCart = new Cart({
            product,
            quantity,
            customer
        });
        await newCart.save();
        console.log(newCart);
        res.status(200).json(newCart);
    } catch (error) {
        console.log(error);
    }
}
export const getCart = async (req, res) => {
    try {
        const customer = req.user._id;
        const cart = await Cart.find({ customer }).populate("product");
        res.json(cart);
    }
    catch (err) {
        console.log(err);
    }
}
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        await cart.deleteOne({ _id: req.params.id });
        res.json({ message: "Cart removed" });
    } catch (error) {
        console.log(error);
    }
}
export const clearCart = async (req, res) => {
    try {
        const customer = req.user._id;
        await Cart.deleteMany({ customer });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        console.log(error);
    }
}
export const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.quantity = req.body.quantity || cart.quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.log(error);
    }
}

export const addToWishlist = async (req, res) => {
    try {
        console.log("called");

        const { product } = req.body;
        const customer = req.user._id;
        const wishlist = await Wishlist.findOne({ product, customer });
        if (wishlist) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        const newWishlist = new Wishlist({
            product,
            customer
        });
        await newWishlist.save();
        res.json(newWishlist);
    } catch (error) {
        console.log(error);
    }
}
export const getWishlist = async (req, res) => {
    try {
        const customer = req.user._id;
        const wishlist = await Wishlist.find({ customer }).populate("product");
        res.json(wishlist);
    }
    catch (err) {
        console.log(err);
    }
}
export const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.deleteOne({ product: req.params.id });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        console.log("removed from wishlist");

        res.json({ message: "Wishlist removed" });
    } catch (error) {
        console.log(error);
    }
}
