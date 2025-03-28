import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = ({ onAddToWishlist }) => {
    const [wishlist, setWishlist] = useState(new Set());
    const scrollContainerRef = useRef(null);

    const products = [
        {
            id: 1,
            name: "Egyptian Cotton Bedsheet Set",
            image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
            price: 129.99,
            oldPrice: 159.99,
            rating: 4.8,
            reviews: 124,
            category: "Bedsheets",
            quantity: 10
        },
        {
            id: 2,
            name: "Soft Cotton Towels",
            image: "https://static8.depositphotos.com/1364867/908/i/950/depositphotos_9086508-stock-photo-folded-towel.jpg",
            price: 119.99,
            oldPrice: 159.99,
            rating: 4.8,
            reviews: 124,
            category: "Towels",
            quantity: 15
        },
        {
            id: 3,
            name: "Blue Polka Dot Bedsheet",
            image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blue%20polka%20dot.jpg",
            price: 129.99,
            oldPrice: 159.99,
            rating: 4.8,
            reviews: 124,
            category: "Bedsheets",
            quantity: 8
        },
        {
            id: 4,
            name: "Luxury Bath Towel Set",
            image: "https://example.com/luxury-towels.jpg",
            price: 89.99,
            oldPrice: 129.99,
            rating: 4.5,
            reviews: 98,
            category: "Towels",
            quantity: 12
        },
        {
            id: 5,
            name: "Decorative Throw Pillow",
            image: "https://example.com/throw-pillow.jpg",
            price: 49.99,
            oldPrice: 69.99,
            rating: 4.6,
            reviews: 76,
            category: "Home Decor",
            quantity: 20
        },
        {
            id: 6,
            name: "Silk Bedding Set",
            image: "https://example.com/silk-bedding.jpg",
            price: 199.99,
            oldPrice: 249.99,
            rating: 4.9,
            reviews: 156,
            category: "Bedsheets",
            quantity: 6
        },
        {
            id: 7,
            name: "Plush Bath Robe",
            image: "https://example.com/bath-robe.jpg",
            price: 79.99,
            oldPrice: 99.99,
            rating: 4.7,
            reviews: 112,
            category: "Bath",
            quantity: 15
        },
        {
            id: 8,
            name: "Decorative Table Runner",
            image: "https://example.com/table-runner.jpg",
            price: 39.99,
            oldPrice: 59.99,
            rating: 4.4,
            reviews: 64,
            category: "Home Decor",
            quantity: 25
        }
    ];

    const toggleWishlist = (productId) => {
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            const product = products.find(p => p.id === productId);

            if (newWishlist.has(productId)) {
                newWishlist.delete(productId);
                onAddToWishlist(product, false);
            } else {
                newWishlist.add(productId);
                onAddToWishlist(product, true);
            }
            return newWishlist;
        });
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        console.log(`Added ${product.name} to cart`);
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="featuredProducts" className={styles.featuredProducts}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Featured Products</h2>
                    <p className={styles.subtitle}>Handpicked premium quality products for your home</p>
                </div>

                <div className={styles.scrollWrapper}>
                    <button className={`${styles.scrollButton} ${styles.scrollLeft}`} onClick={scrollLeft}>
                        <FaChevronLeft />
                    </button>
                    <button className={`${styles.scrollButton} ${styles.scrollRight}`} onClick={scrollRight}>
                        <FaChevronRight />
                    </button>
                    <div ref={scrollContainerRef} className={styles.scrollContainer}>
                        <div className={styles.grid}>
                            {products.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className={styles.product} >
                                    <div className={styles.imageContainer}>
                                        <span className={styles.discount}>
                                            {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                        </span>
                                        <button className={styles.wishlistButton}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(product.id);
                                            }}
                                        >
                                            {wishlist.has(product.id) ? <FaHeart className={styles.wishlistIconActive} /> : <FaRegHeart className={styles.wishlistIcon} />}
                                        </button>
                                        <img src={product.image || "/placeholder.svg"} alt={product.name} className={styles.image} />
                                    </div>
                                    <div className={styles.content}>
                                        <span className={styles.category}>{product.category}</span>
                                        <div className={styles.name}>{product.name}</div>
                                        <div className={styles.rating}>
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                    className={styles.stars} fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                                    stroke="currentColor" strokeWidth="2">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            ))}
                                            <span className={styles.reviews}>({product.reviews})</span>
                                        </div>
                                        <div className={styles.prices}>
                                            <span className={styles.price}>₹{product.price}</span>
                                            <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                        </div>
                                        <button className={styles.addToCart} onClick={(e) => handleAddToCart(e, product)} disabled={product.quantity <= 0} >
                                            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;