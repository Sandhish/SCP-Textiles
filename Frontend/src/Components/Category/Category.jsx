import { Link } from "react-router-dom";
import styles from "./Category.module.css";

const categories = [
    {
        id: 1,
        name: "Bedsheets",
        image: "https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg",
        link: "/products/bedsheets",
        description: "Luxurious comfort for a perfect night's sleep",
    },
    {
        id: 2,
        name: "Towels",
        image: "https://th.bing.com/th/id/OIP.VefLND7RJ6jwnPxoRr5aZAAAAA?rs=1&pid=ImgDetMain",
        link: "/products/towels",
        description: "Soft, absorbent, and quick-drying",
    },
    {
        id: 3,
        name: "Floor Mats",
        image: "https://5.imimg.com/data5/GR/UY/MY-24014740/floor-mat-1000x1000.jpg",
        link: "/products/floormats",
        description: "Stylish protection for your floors",
    },
    {
        id: 4,
        name: "Pillow Covers",
        image: "https://th.bing.com/th/id/OIP.xVPQjbZiZBim3kdcWF6p_gHaHa?pid=ImgDet&w=474&h=474&rs=1",
        link: "/products/pillowcovers",
        description: "Add a touch of elegance to your bedroom",
    },
];

const Category = () => {
    return (
        <section id="category" className={styles.categories}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Shop by Category</h2>
                    <p className={styles.subtitle}>Explore our wide range of premium home textiles</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link to={category.link} key={category.id} className={styles.category}>
                            <div className={styles.imageContainer}>
                                <img src={category.image || "/placeholder.svg"} alt={category.name} className={styles.image} />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.categoryTitle}>{category.name}</h3>
                                <p className={styles.description}>{category.description}</p>
                                <span className={styles.link}>Shop Now</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Category;