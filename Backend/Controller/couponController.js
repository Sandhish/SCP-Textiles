import Coupon from "../Models/Coupon.model.js";

export const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discount,
            expiryDate
        });
        
        res.status(201).json(coupon);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate, isActive } = req.body;
        
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        if (code !== coupon.code) {
            const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
            if (existingCoupon && existingCoupon._id.toString() !== req.params.id) {
                return res.status(400).json({ message: "Coupon code already exists" });
            }
        }
        
        coupon.code = code ? code.toUpperCase() : coupon.code;
        coupon.discount = discount !== undefined ? discount : coupon.discount;
        coupon.expiryDate = expiryDate || coupon.expiryDate;
        coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
        
        await coupon.save();
        res.json(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() }
        });
        
        if (!coupon) {
            return res.status(404).json({ 
                valid: false,
                message: "Invalid or expired coupon code" 
            });
        }
        
        res.json({ 
            valid: true,
            discount: coupon.discount,
            expiryDate: coupon.expiryDate
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};