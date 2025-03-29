import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
},
    { timestamps: true });
const Review = mongoose.model('Review', ReviewSchema);
export default Review;