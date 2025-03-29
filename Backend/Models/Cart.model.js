import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
},
    { timestamps: true });
export const Cart = mongoose.model('Cart', CartSchema);