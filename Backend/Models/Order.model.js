import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    shippingDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    trackingNumber: {
        type: String
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

OrderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const timestamp = new Date().getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `OD${timestamp}${random}`;
    }
    next();
});


export const Order = mongoose.model("Order", OrderSchema);