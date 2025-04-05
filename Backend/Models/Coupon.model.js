import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;