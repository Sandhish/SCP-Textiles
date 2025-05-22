import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProductList.module.css";
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProductList = ({ onAddToWishlist, onOpenSidebar }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  const categoryToTagMap = {
    bedsheets: "bedsheet",
    towels: "towel",
    floormats: "floormat",
    pillowcovers: "pillowcover",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const tag = categoryToTagMap[category];
        if (!tag) {
          throw new Error("Invalid category");
        }

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API
          }/api/productRoutes/products?tag=${tag}`
        );
        setProducts(response.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
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
      }
    };
    fetchWishlist();
    fetchProducts();
  }, [category]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/cart/add`,
        { product: product._id, quantity: 1 },
        { withCredentials: true }
      );
      if (result.status === 200) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast.error("Failed to add product to cart. Please try again later.");
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.has(productId)) {
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_API
          }/api/productRoutes/wishlist/remove/${productId}`,
          { withCredentials: true }
        );
        setWishlist(
          (prev) => new Set([...prev].filter((id) => id !== productId))
        );
        toast.error("Removed from wishlist");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist/add`,
          { product: productId },
          { withCredentials: true }
        );
        setWishlist((prev) => new Set(prev).add(productId));
        toast.success("Added to wishlist");
      }
      onAddToWishlist && onAddToWishlist(productId);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error("Failed to update wishlist. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...products];

    switch (option) {
      case "lowToHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className={styles.notFound}>No products found for this category</div>
    );
  }

  return (
    <div className={styles.categoryProducts}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h1 className={styles.title}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className={styles.sortContainer}>
          <label htmlFor="sort" className={styles.sortLabel}>
            Sort by:
          </label>
          <select
            id="sort"
            className={styles.sortSelect}
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <Link to={`/product/${product._id}`} className={styles.productLink}>
              <div className={styles.productImageContainer}>
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
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>₹{product.price}</span>
                  <button
                    className={styles.addToCartBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(e, product);
                    }}
                    disabled={product.quantity <= 0}
                  >
                    {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
