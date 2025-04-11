import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import styles from "./FeaturedProducts.module.css";
import axios from "axios";

const FeaturedProducts = ({ onAddToWishlist }) => {
  const [wishlist, setWishlist] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/products`
        );
        if (!response.data || response.data.length === 0) {
          throw new Error("No products found");
        }
        const featuredProducts = response.data.filter(
          (product) => product.tag === "featured"
        );
        setProducts(featuredProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist`,
          { withCredentials: true }
        );
        if (response.data && response.data.length > 0) {
          const wishlistSet = new Set(
            response.data.map((item) => item.product._id)
          );
          console.log(wishlistSet);

          setWishlist(wishlistSet);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        // setError("Failed to load wishlist. Please try again later.");
      }
    };
    fetchWishlist();
    fetchFeaturedProducts();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.has(productId)) {
        console.log("awdiobcsi");

        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_API
          }/api/productRoutes/wishlist/remove/${productId}`,
          { withCredentials: true }
        );
        setWishlist(
          (prev) => new Set([...prev].filter((id) => id !== productId))
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist/add`,
          { product: productId },
          { withCredentials: true }
        );
        setWishlist((prev) => new Set(prev).add(productId));
      }
      onAddToWishlist && onAddToWishlist(productId);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      alert("Failed to update wishlist. Please try again later.");
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/cart/add`,
        { product: product._id, quantity: 1 },
        { withCredentials: true }
      );
      if (result.status === 200) {
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart. Please try again later.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("Failed to add product to cart. Please try again later.");
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading featured products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (products.length === 0)
    return <div className={styles.noProducts}>No featured products found.</div>;

  return (
    <section id="featuredProducts" className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Products</h2>
          <p className={styles.subtitle}>
            Handpicked premium quality products for your home
          </p>
        </div>

        <div className={styles.scrollWrapper}>
          <button
            className={`${styles.scrollButton} ${styles.scrollLeft}`}
            onClick={scrollLeft}
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${styles.scrollButton} ${styles.scrollRight}`}
            onClick={scrollRight}
          >
            <FaChevronRight />
          </button>
          <div ref={scrollContainerRef} className={styles.scrollContainer}>
            <div className={styles.grid}>
              {products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className={styles.product}
                >
                  <div className={styles.imageContainer}>
                    {product.oldPrice && (
                      <span className={styles.discount}>
                        {Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                    <button
                      className={styles.wishlistButton}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                      }}
                    >
                      {wishlist.has(product._id) ? (
                        <FaHeart className={styles.wishlistIconActive} />
                      ) : (
                        <FaRegHeart className={styles.wishlistIcon} />
                      )}
                    </button>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.content}>
                    <span className={styles.category}>{product.tag}</span>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          className={styles.stars}
                          fill={
                            i < Math.floor(product.rating || 0)
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                      <span className={styles.reviews}>
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                    <div className={styles.prices}>
                      <span className={styles.price}>₹{product.price}</span>
                      {product.oldPrice && (
                        <span className={styles.oldPrice}>
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>
                    <button
                      className={styles.addToCart}
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.quantity <= 0}
                    >
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
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
