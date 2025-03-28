import React, { useState } from "react";
import { FaArrowLeft, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const product = {
        _id: "1",
        name: "Handwoven Cotton Bedsheet",
        image: "https://via.placeholder.com/300",
        price: 1499,
        quantity: 10,
        description: "A beautifully crafted handwoven bedsheet made from 100% organic cotton.",
        review: [
            { customerName: "John Doe", rating: 4, comment: "Great quality!" },
            { customerName: "Jane Smith", rating: 5, comment: "Super soft and comfortable." }
        ]
    };

    const handleBack = () => {
        navigate(-1);
    };

    const increment = () => {
        if (count < product.quantity) {
            setCount(count + 1);
        }
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const handleAddToWishlist = () => {
        if (isInWishlist) {
            setWishlistItems(wishlistItems.filter((item) => item._id !== product._id));
            setIsInWishlist(false);
        } else {
            setWishlistItems([...wishlistItems, product]);
            setIsInWishlist(true);
        }
        setIsWishlistOpen(true);
    };

    const handleRemoveFromWishlist = (itemId) => {
        setWishlistItems(wishlistItems.filter((item) => item._id !== itemId));
        if (itemId === product._id) {
            setIsInWishlist(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} />);
            } else if (i - rating < 1) {
                stars.push(<FaStar key={i} />);
            } else {
                stars.push(<FaRegStar key={i} />);
            }
        }
        return stars;
    };

    const addToCartFromWishlist = (item) => {
        console.log("Added to cart from wishlist:", item);
    };

    const writeReview = () => {
        console.log('Write a review');
    };

    return (
        <div className={styles.productContainer}>
            <button onClick={handleBack} className={styles.backButton}>
                <FaArrowLeft />
                <span>Back</span>
            </button>
            <div className={styles.productContent}>
                <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                </div>

                <div className={styles.productDetails}>
                    <div className={styles.productHeaderDetails}>
                        <h1 className={styles.productTitle}>{product.name}</h1>
                        <button className={styles.heartButton} onClick={handleAddToWishlist}>
                            {isInWishlist ? <FaHeart className={styles.checked} /> : <FaRegHeart className={styles.unchecked} />}
                        </button>
                    </div>

                    <div className={styles.ratingContainer}>
                        <div className={styles.starRating}>
                            {renderStars(4.5)}
                        </div>
                        <span className={styles.ratingCount}>({product.review.length} reviews)</span>
                    </div>

                    <div className={styles.priceContainer}>
                        <span className={styles.currentPrice}>Rs.{product.price}.00</span>
                    </div>

                    <p className={styles.productDescription}>
                        {product.description || "No description available."}
                    </p>

                    <div className={styles.actionContainer}>
                        <div className={styles.quantityControls}>
                            <button className={styles.quantityButton} onClick={decrement} disabled={count <= 1} >
                                <HiMinus />
                            </button>
                            <span className={styles.quantityDisplay}>{count}</span>
                            <button className={styles.quantityButton} onClick={increment} disabled={count >= product.quantity} >
                                <GoPlus />
                            </button>
                        </div>

                        <button className={styles.addToCartButton} disabled={product.quantity <= 0} >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.reviewsSection}>
                <div className={styles.reviewsHeader}>
                    <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
                    <button className={styles.writeReviewButton} onClick={writeReview}>
                        Write a Review
                    </button>
                </div>
                {product.review && product.review.length > 0 ? (
                    product.review.map((review, index) => (
                        <div key={index} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewerName}>{review.customerName}</div>
                                <div className={styles.reviewDate}>2 days ago</div>
                            </div>
                            <div className={styles.starRating}>
                                {renderStars(review.rating)}
                            </div>
                            <p className={styles.reviewContent}>
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <h3>No reviews yet</h3>
                )}
            </div>

            {isWishlistOpen && (
                <div className={styles.wishlistSidebar}>
                    <h2>Wishlist</h2>
                    {wishlistItems.map((item) => (
                        <div key={item._id} className={styles.wishlistItem}>
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>Rs.{item.price}</p>
                                <button onClick={() => handleRemoveFromWishlist(item._id)}>Remove</button>
                                <button onClick={() => addToCartFromWishlist(item)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setIsWishlistOpen(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ProductPage;