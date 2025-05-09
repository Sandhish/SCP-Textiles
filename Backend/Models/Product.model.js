import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});
const Product = mongoose.model('Product', ProductSchema);
export default Product;