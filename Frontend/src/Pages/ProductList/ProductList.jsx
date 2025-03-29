import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductList.module.css';

const productData = {
    bedsheets: [
        {
            id: 1,
            name: "Blush Pink Zigzag Bedsheet",
            image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
            price: 1299,
            description: "Soft cotton bedsheet with elegant zigzag pattern"
        },
        {
            id: 2,
            name: "Sage Green Floral Bedsheet",
            image: "https://example.com/sage-green-bedsheet.jpg",
            price: 1499,
            description: "Luxurious bedsheet with delicate floral print"
        },
        {
            id: 3,
            name: "Blush Pink Zigzag Bedsheet",
            image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
            price: 1599,
            description: "Soft cotton bedsheet with elegant zigzag pattern"
        },
        {
            id: 4,
            name: "Sage Green Floral Bedsheet",
            image: "https://example.com/sage-green-bedsheet.jpg",
            price: 1699,
            description: "Luxurious bedsheet with delicate floral print"
        },
        {
            id: 5,
            name: "Blush Pink Zigzag Bedsheet",
            image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
            price: 1199,
            description: "Soft cotton bedsheet with elegant zigzag pattern"
        },
        {
            id: 6,
            name: "Sage Green Floral Bedsheet",
            image: "https://example.com/sage-green-bedsheet.jpg",
            price: 2999,
            description: "Luxurious bedsheet with delicate floral print"
        },
    ],
    towels: [
        {
            id: 1,
            name: "Premium Cotton Towel",
            image: "https://th.bing.com/th/id/OIP.VefLND7RJ6jwnPxoRr5aZAAAAA?rs=1&pid=ImgDetMain",
            price: 599,
            description: "Soft and absorbent cotton towel"
        }
    ],
    floormats: [
        {
            id: 1,
            name: "Anti-Slip Floor Mat",
            image: "https://5.imimg.com/data5/GR/UY/MY-24014740/floor-mat-1000x1000.jpg",
            price: 349,
            description: "Durable and stylish floor protection"
        }
    ],
    pillowcovers: [
        {
            id: 1,
            name: "Elegant Silk Pillow Cover",
            image: "https://th.bing.com/th/id/OIP.xVPQjbZiZBim3kdcWF6p_gHaHa?pid=ImgDet&w=474&h=474&rs=1",
            price: 249,
            description: "Smooth and luxurious pillow cover"
        }
    ]
};

const ProductList = () => {
    const { category } = useParams();
    const [sortOption, setSortOption] = useState('default');
    const [products, setProducts] = useState(productData[category] || []);

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
                sortedProducts = productData[category];
        }

        setProducts(sortedProducts);
    };

    if (!productData[category]) {
        return <div className={styles.notFound}>No products found for this category</div>;
    }

    return (
        <div className={styles.categoryProducts}>
            <div className={styles.header}>
                <h1 className={styles.title}>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>

                <div className={styles.sortContainer}>
                    <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
                    <select id="sort" className={styles.sortSelect} value={sortOption} onChange={(e) => handleSort(e.target.value)} >
                        <option value="default">Default</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className={styles.productGrid}>
                {products.map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.productImageContainer}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                        </div>
                        <div className={styles.productDetails}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productDescription}>{product.description}</p>
                            <div className={styles.priceContainer}>
                                <span className={styles.price}>₹{product.price}</span>
                                <button className={styles.addToCartBtn}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;