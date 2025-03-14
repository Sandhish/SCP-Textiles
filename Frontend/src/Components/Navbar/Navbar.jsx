import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link to="/">
                        <h1>SCP Textile</h1>
                    </Link>
                </div>

                <div className={`${styles.navigation} ${menuOpen ? styles.active : ""}`}>
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>
                                <Link to="/" className={styles.navLink}>Home</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/products/bedsheets" className={styles.navLink}>Bedsheets</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/products/towels" className={styles.navLink}>Towels</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/products/floormats" className={styles.navLink}>Floor Mats</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/products/pillowcovers" className={styles.navLink}>Pillow Covers</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className={styles.actions}>
                    <div className={`${styles.search} ${searchOpen ? styles.active : ""}`}>
                        <button className={styles.searchToggle} onClick={() => setSearchOpen(!searchOpen)} aria-label="Toggle search" >
                            <Search />
                        </button>
                        {searchOpen && (
                            <div className={styles.searchContainer}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className={styles.searchInput}
                                />
                                <button className={styles.searchButton}>Search</button>
                            </div>
                        )}
                    </div>

                    <div className={styles.cart}>
                        <Link to="/cart" className={styles.cartLink}>
                            <ShoppingCart />                            <span className={styles.cartCount}>3</span>
                        </Link>
                    </div>

                    <div className={styles.account}>
                        <Link to="/account" className={styles.accountLink}><UserRound /></Link>
                    </div>

                    <button
                        className={styles.menuToggle}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
}
