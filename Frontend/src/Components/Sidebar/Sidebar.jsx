import React, { useState, useEffect } from "react";
import {
  UserRound,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Services/authService";
import axios from "axios";

const UserSidebar = ({ isOpen, onClose, userData }) => {
  const [activeView, setActiveView] = useState("profile");
  const [previousView, setPreviousView] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      orderNumber: 1001,
      totalAmount: 5999,
      date: "2023-05-15",
      status: "Delivered",
    },
    {
      id: 2,
      orderNumber: 1002,
      totalAmount: 3499,
      date: "2023-06-20",
      status: "Shipped",
    },
    {
      id: 3,
      orderNumber: 1003,
      totalAmount: 7999,
      date: "2023-07-10",
      status: "Processing",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/wishlist`,
          { withCredentials: true }
        );
        if (response.data) {
          const mapped = response.data.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
          }));
          setWishlistItems(mapped);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, []);

  const menuItems = [
    {
      icon: <ShoppingBag />,
      label: "My Orders",
      view: "orders",
      action: () => {
        setPreviousView("profile");
        setActiveView("orders");
      },
    },
    {
      icon: <Heart />,
      label: "Wishlist",
      view: "wishlist",
      action: () => {
        setPreviousView("profile");
        setActiveView("wishlist");
      },
    },
    {
      icon: <Settings />,
      label: "Account Settings",
      view: "settings",
      action: () => {
        setPreviousView("profile");
        setActiveView("settings");
      },
    },
    {
      icon: <HelpCircle />,
      label: "Help & Support",
      view: "support",
      action: () =>
        (window.location.href = `mailto:${import.meta.env.VITE_SUPPORT_MAIL}`),
    },
  ];

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/productRoutes/wishlist/${itemId}`,
        { withCredentials: true }
      );
      setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleBack = () => {
    if (previousView) {
      setActiveView(previousView);
      setPreviousView(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    setWishlistItems([]);
    setOrderItems([]);
    setActiveView("profile");
    setPreviousView(null);
    await logout();
    window.location.reload();
  };

  const renderHeader = () => {
    switch (activeView) {
      case "profile":
        return (
          <div className={styles.sidebarHeader}>
            <h2>My Account</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>
        );
      case "orders":
      case "wishlist":
      case "settings":
        return (
          <div className={styles.sidebarHeader}>
            <button onClick={handleBack} className={styles.backButton}>
              <ChevronRight size={24} style={{ transform: "rotate(180deg)" }} />
            </button>
            <h2>
              {activeView === "orders"
                ? "My Orders"
                : activeView === "wishlist"
                ? "Wishlist"
                : "Account Settings"}
            </h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return (
          <div className={styles.sidebarContent}>
            <div className={styles.profileContent}>
              <div className={styles.userProfileHeader}>
                <div className={styles.userAvatar}>
                  {userData?.name ? userData.name[0].toUpperCase() : "U"}
                </div>
                <div className={styles.userInfo}>
                  <h3>{userData?.name || "User"}</h3>
                  <p>{userData?.email || "user@example.com"}</p>
                </div>
              </div>
              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <span>Total Orders</span>
                  <strong>{orderItems.length}</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Wishlist</span>
                  <strong>{wishlistItems.length}</strong>
                </div>
              </div>
            </div>

            <div className={styles.sidebarMenu}>
              {menuItems.map((item) => (
                <button
                  key={item.view}
                  className={styles.menuItem}
                  onClick={item.action}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.logoutSection}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className={styles.sidebarContent}>
            <div className={styles.ordersContent}>
              <div className={styles.orderList}>
                {orderItems.map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <div className={styles.orderDetails}>
                      <div className={styles.orderHeader}>
                        <span className={styles.orderNumber}>
                          Order #{order.orderNumber}
                        </span>
                        <span className={styles.orderStatus}>
                          {order.status}
                        </span>
                      </div>
                      <div className={styles.orderInfo}>
                        <span className={styles.orderDate}>{order.date}</span>
                        <span className={styles.orderAmount}>
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                ))}
                {orderItems.length === 0 && (
                  <div className={styles.emptyOrders}>
                    <p>No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "wishlist":
        return (
          <div className={styles.sidebarContent}>
            <div className={styles.wishlistContent}>
              <div className={styles.wishlistItems}>
                {wishlistItems.map((item) => (
                  <div key={item.id} className={styles.wishlistItem}>
                    <div className={styles.wishlistItemImage}>
                      <img
                        src={item.image || "/fallback.jpg"}
                        alt={item.name || "Product"}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.productName}>{item.name}</span>
                      <span className={styles.productPrice}>
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.wishlistActions}>
                      <button
                        className={styles.removeFromWishlist}
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Heart size={20} fill="currentColor" color="red" />
                      </button>
                    </div>
                  </div>
                ))}
                {wishlistItems.length === 0 && (
                  <div className={styles.emptyWishlist}>
                    <p>Your wishlist is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className={styles.sidebarContent}>
            <div className={styles.settingsContent}>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <span>Edit Profile</span>
                  <ChevronRight size={20} />
                </div>
                <div
                  onClick={() => navigate("/forgot-password")}
                  className={styles.settingItem}
                >
                  <span>Change Password</span>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <div className={`${styles.userSidebar} ${isOpen ? styles.open : ""}`}>
        {renderHeader()}
        {renderContent()}
      </div>
    </>
  );
};

export default UserSidebar;
