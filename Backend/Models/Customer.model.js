import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    purchasedProduts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
}, { timestamps: true });
CustomerSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
CustomerSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}
export const Customer = mongoose.model("Customer", CustomerSchema);