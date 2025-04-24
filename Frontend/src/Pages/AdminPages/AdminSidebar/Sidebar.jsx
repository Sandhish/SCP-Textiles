import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ setActiveContent, activeContent, isMobile, onLogout }) => {
    const menuItems = [
        {
            id: 'productUpload',
            label: 'Upload Product',
            icon: '📤'
        },
        {
            id: 'productManagement',
            label: 'Manage Products',
            icon: '📋'
        },
        {
            id: 'couponUpload',
            label: 'Upload Coupon',
            icon: '🏷️'
        },
        {
            id: 'couponManagement',
            label: 'Manage Coupons',
            icon: '💳'
        },
        {
            id: 'sendMail',
            label: 'Send Mail',
            icon: '✉️'
        },
        {
            id: 'logout',
            label: 'Logout',
            icon: '🔚'
        }
    ];

    return (
        <div className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''}`}>
            <div className={styles.sidebarTitle}>
                <h2>Admin Dashboard</h2>
            </div>
            <nav className={styles.sidebarMenu}>
                {menuItems.map((item) => (
                    <button key={item.id}
                        className={`${styles.menuItem} ${activeContent === item.id ? styles.active : ''}`}
                        onClick={() => {
                            if (item.id === 'logout') {
                                onLogout();
                            } else {
                                setActiveContent(item.id);
                            }
                        }}
                    >
                        <span className={styles.menuIcon}>{item.icon}</span>
                        <span className={styles.menuLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;