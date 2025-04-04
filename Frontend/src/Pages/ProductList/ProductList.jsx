import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ProductList.module.css';
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

const ProductList = ({ onAddToWishlist, onOpenSidebar }) => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('default');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState(new Set());

    const categoryToTagMap = {
        'bedsheets': 'bedsheet',
        'towels': 'towel',
        'floormats': 'floormat',
        'pillowcovers': 'pillowcover'
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const tag = categoryToTagMap[category];
                if (!tag) {
                    throw new Error('Invalid category');
                }

                const response = await axios.get(`http://localhost:5001/api/productRoutes/products?tag=${tag}`);
                setProducts(response.data);

                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const handleAddToCart = async (product) => {

    };

    const toggleWishlist = async (productId) => {

    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSort = (option) => {
        setSortOption(option);
        let sortedProducts = [...products];

        switch (option) {
            case 'lowToHigh':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'highToLow':
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
        return <div className={styles.notFound}>No products found for this category</div>;
    }

    return (
        <div className={styles.categoryProducts}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    <FaArrowLeft />
                    <span>Back</span>
                </button>
                <h1 className={styles.title}>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
                <div className={styles.sortContainer}>
                    <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
                    <select id="sort" className={styles.sortSelect} value={sortOption} onChange={(e) => handleSort(e.target.value)}>
                        <option value="default">Default</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className={styles.productGrid}>
                {products.map(product => (
                    <div key={product._id} className={styles.productCard}>
                        <Link to={`/product/${product._id}`} className={styles.productLink}>
                            <div className={styles.productImageContainer}>
                                <button className={styles.wishlistButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product._id);
                                    }} >
                                    {wishlist.has(product._id) ?
                                        <FaHeart className={styles.wishlistIconActive} /> :
                                        <FaRegHeart className={styles.wishlistIcon} />}
                                </button>
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                            </div>
                            <div className={styles.productDetails}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDescription}>{product.description}</p>
                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>₹{product.price}</span>
                                    <button
                                        className={styles.addToCartBtn}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product);
                                        }}
                                        disabled={product.quantity <= 0}
                                    >
                                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
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
