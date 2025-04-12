import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProductPage.module.css";

const ProductPage = ({ onAddToWishlist, onOpenSidebar }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/${id}`
        );
        setProduct(response.data);

        try {
          const wishlistResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist`,
            { withCredentials: true }
          );
          const inWishlist = wishlistResponse.data.some(
            (item) => item.product._id === id
          );
          setIsInWishlist(inWishlist);
        } catch (wishlistError) {
          console.log("Couldn't fetch wishlist:", wishlistError);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const increment = () => {
    if (product && count < product.quantity) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (isInWishlist) {
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_API
          }/api/productRoutes/wishlist/remove/${id}`,
          { withCredentials: true }
        );
        setIsInWishlist(false);
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist/add`,
          { product: id },
          { withCredentials: true }
        );
        setIsInWishlist(true);
      }

      if (onAddToWishlist) {
        onAddToWishlist(id);
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      alert("Please login to modify wishlist.");
      navigate("/login");
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/cart/add`,
        {
          product: id,
          quantity: count,
        },
        { withCredentials: true }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Please login to add to cart.");
      navigate("/login");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const writeReview = () => {
    console.log("Write a review");
  };

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (error || !product) {
    return <div className={styles.error}>{error || "Product not found"}</div>;
  }

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
            <button
              className={styles.heartButton}
              onClick={handleAddToWishlist}
            >
              {isInWishlist ? (
                <FaHeart className={styles.checked} />
              ) : (
                <FaRegHeart className={styles.unchecked} />
              )}
            </button>
          </div>

          <div className={styles.ratingContainer}>
            <div className={styles.starRating}>
              {renderStars(
                product.review && product.review.length > 0
                  ? product.review.reduce((avg, r) => avg + r.rating, 0) /
                      product.review.length
                  : 0
              )}
            </div>
            <span className={styles.ratingCount}>
              ({product.review ? product.review.length : 0} reviews)
            </span>
          </div>

          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>Rs.{product.price}.00</span>
          </div>

          <p className={styles.productDescription}>
            {product.description || "No description available."}
          </p>

          <div className={styles.actionContainer}>
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityButton}
                onClick={decrement}
                disabled={count <= 1}
              >
                <HiMinus />
              </button>
              <span className={styles.quantityDisplay}>{count}</span>
              <button
                className={styles.quantityButton}
                onClick={increment}
                disabled={count >= product.quantity}
              >
                <GoPlus />
              </button>
            </div>

            <button
              className={styles.addToCartButton}
              disabled={product.quantity <= 0}
              onClick={handleAddToCart}
            >
              {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
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
              <p className={styles.reviewContent}>{review.comment}</p>
            </div>
          ))
        ) : (
          <h3>No reviews yet</h3>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
