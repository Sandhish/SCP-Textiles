import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, UserRound, X, Menu } from "lucide-react";
import styles from "./Navbar.module.css";
import UserSidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setUserSidebarOpen(true);
      setMenuOpen(false);
    } else {
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/" onClick={closeMenu}>
              <img src="logo.png" alt="Logo" className={styles.logoImg} />
            </Link>
          </div>

          {menuOpen && isMobile && (
            <div className={styles.mobileOverlay} onClick={closeMenu}>
              <div
                className={styles.mobileMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeMenuButton}
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>

                <form
                  className={styles.searchContainer}
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchButton}>
                    <Search size={20} />
                  </button>
                </form>

                <nav className={styles.mobileNav}>
                  <ul>
                    <li>
                      <a href="#home" onClick={closeMenu}>
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#featuredProducts" onClick={closeMenu}>
                        Products
                      </a>
                    </li>
                    <li>
                      <a href="#category" onClick={closeMenu}>
                        Categories
                      </a>
                    </li>
                    <li>
                      <a href="#about" onClick={closeMenu}>
                        About
                      </a>
                    </li>

                    {isAuthenticated ? (
                      <>
                        <li
                          className={styles.mbeSidebar}
                          onClick={handleAccountClick}
                        >
                          Profile
                        </li>
                        <li>
                          <Link to="/logout" onClick={closeMenu}>
                            Logout
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link to="/login" onClick={closeMenu}>
                          Login
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>

                <div className={styles.mobileSidebar}>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className={styles.mobileCartLink}
                  >
                    <ShoppingCart />
                    <span className={styles.cartCount}>{cartCount}</span>
                    Cart
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div
            className={`${styles.navigation} ${
              !isMobile ? styles.desktopNavigation : ""
            }`}
          >
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <a href="#home" className={styles.navLink}>
                    Home
                  </a>
                </li>
                <li className={styles.navItem}>
                  <a href="#featuredProducts" className={styles.navLink}>
                    Products
                  </a>
                </li>
                <li className={styles.navItem}>
                  <a href="#category" className={styles.navLink}>
                    Categories
                  </a>
                </li>
                <li className={styles.navItem}>
                  <a href="#about" className={styles.navLink}>
                    About
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className={styles.actions}>
            {!isMobile && (
              <form
                className={styles.searchContainer}
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchButton}>
                  <Search size={20} />
                </button>
              </form>
            )}

            <div className={styles.cart}>
              <Link to="/cart" className={styles.cartLink}>
                <ShoppingCart />
                <span className={styles.cartCount}>{cartCount}</span>
              </Link>
            </div>

            <div className={styles.account}>
              {isAuthenticated ? (
                <div className={styles.userMenu} onClick={handleAccountClick}>
                  <div className={styles.accountLink}>
                    <UserRound />
                    <span className={styles.username}>
                      {user?.name || "Profile"}
                    </span>
                  </div>
                </div>
              ) : (
                <Link to="/login" className={styles.loginLink}>
                  <span>Login</span>
                </Link>
              )}
            </div>

            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <UserSidebar
        isOpen={userSidebarOpen}
        onClose={() => setUserSidebarOpen(false)}
        userData={user}
      />
    </>
  );
};

export default Navbar;
