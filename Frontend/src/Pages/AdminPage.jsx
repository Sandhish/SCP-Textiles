import React, { useState, useEffect } from "react";
import ProductUpload from "./AdminPages/ProductUpload/ProductUpload";
import CouponUpload from "./AdminPages/CouponUpload/CouponUpload";
import ProductManagement from "./AdminPages/Management/ProductManagement";
import CouponManagement from "./AdminPages/Management/CouponManagement";
import SendMail from "./AdminPages/Management/SendMail";
import Sidebar from "./AdminPages/AdminSidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { logout } from "../Services/authService";
import UserManagement from "./AdminPages/UserManagement/UserManagement";

const AdminPage = () => {
  const [activeContent, setActiveContent] = useState("productUpload");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeContent) {
      case "productUpload":
        return <ProductUpload />;
      case "productManagement":
        return <ProductManagement />;
      case "userManagement":
        return <UserManagement />;
      case "couponUpload":
        return <CouponUpload />;
      case "couponManagement":
        return <CouponManagement />;
      case "sendMail":
        return <SendMail />;
      case "logout":
        return <div>Logging out...</div>;
      default:
        return <ProductUpload />;
    }
  };

  const handleSidebarItemClick = (contentId) => {
    setActiveContent(contentId);

    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await logout();
    navigate("/login");
  };

  const styles = {
    adminPageContainer: {
      display: "flex",
      height: "100vh",
      backgroundColor: "#f4f4f4",
      position: "relative",
      overflow: "hidden",
      flexDirection: isMobile ? "column" : "row",
    },
    mainContent: {
      flexGrow: 1,
      padding: "20px",
      backgroundColor: "white",
      margin: isMobile ? "0" : "10px",
      borderRadius: isMobile ? "0" : "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
      transition: "all 0.3s ease",
    },
    sidebarToggleButton: {
      position: "fixed",
      top: "15px",
      left: "15px",
      zIndex: 1000,
      backgroundColor: "var(--button-color)",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "50%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    sidebarToggleButtonHover: {
      backgroundColor: "var(--button-hover-color)",
      transform: "rotate(90deg)",
    },
  };

  return (
    <div style={styles.adminPageContainer}>
      {isMobile && (
        <button
          style={styles.sidebarToggleButton}
          onClick={toggleSidebar}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.sidebarToggleButtonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.sidebarToggleButton.backgroundColor)
          }
        >
          {isSidebarVisible ? "✕" : "☰"}
        </button>
      )}

      {(isSidebarVisible || !isMobile) && (
        <Sidebar
          setActiveContent={handleSidebarItemClick}
          activeContent={activeContent}
          isMobile={isMobile}
          onLogout={handleLogout}
        />
      )}

      <div style={styles.mainContent}>{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
