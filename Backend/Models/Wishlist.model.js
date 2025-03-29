import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const WishlistSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
});
const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;