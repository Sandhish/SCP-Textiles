import { Link } from "react-router-dom"; 
import styles from "./FeaturedProducts.module.css";

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
        link: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
    },
    {
        id: 2,
        name: "Towels",
        image: "https://static8.depositphotos.com/1364867/908/i/950/depositphotos_9086508-stock-photo-folded-towel.jpg",
        price: 119.99,
        oldPrice: 159.99,
        rating: 4.8,
        reviews: 124,
        category: "Towels",
        link: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20cream%20geometric.jpg",
    },
    {
        id: 3,
        name: "Egyptian Cotton Bedsheet Set",
        image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blue%20polka%20dot.jpg",
        price: 129.99,
        oldPrice: 159.99,
        rating: 4.8,
        reviews: 124,
        category: "Bedsheets",
        link: "/products/egyptian-cotton-bedsheet-set",
    },
    {
        id: 4,
        name: "Egyptian Cotton Bedsheet Set",
        image: "https://www.pngkey.com/png/full/446-4466275_bed-sheet.png",
        price: 129.99,
        oldPrice: 159.99,
        rating: 4.8,
        reviews: 124,
        category: "Bedsheets",
        link: "/products/egyptian-cotton-bedsheet-set",
    },
];

export default function FeaturedProducts() {
    return (
        <section id="featuredProducts" className={styles.featuredProducts}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Featured Products</h2>
                    <p className={styles.subtitle}>Handpicked premium quality products for your home</p>
                </div>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.product}>
                            <div className={styles.imageContainer}>
                                <span className={styles.discount}>
                                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                </span>
                                <img src={product.image || "/placeholder.svg"} alt={product.name} className={styles.image} />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.category}>{product.category}</span>
                                <Link to={product.link} className={styles.name}>{product.name}</Link>
                                <div className={styles.rating}>
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    ))}
                                    <span className={styles.reviews}>({product.reviews})</span>
                                </div>
                                <div className={styles.prices}>
                                    <span className={styles.price}>₹{product.price}</span>
                                    <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                </div>
                                <button className={styles.addToCart}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.viewAll}>
                    <Link to="/products" className={styles.viewAllButton}>View All Products</Link>
                </div>
            </div>
        </section>
    );
}