import React, { useState } from 'react';
import styles from './CouponUpload.module.css';

const CouponUpload = () => {
    const [couponData, setCouponData] = useState({
        code: '',
        discountPercentage: '',
        expiryDate: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Coupon Data:', couponData);
    };

    return (
        <div className={styles.couponUploadContainer}>
            <h2 className={styles.pageTitle}>Create New Coupon</h2>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.label}>Coupon Code</label>
                    <input type="text" id="code" name="code" value={couponData.code} onChange={handleInputChange}
                        className={styles.input} required placeholder="Enter unique coupon code" />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="discountPercentage" className={styles.label}>Discount Percentage</label>
                    <input type="number" id="discountPercentage" name="discountPercentage" className={styles.input}
                        value={couponData.discountPercentage} onChange={handleInputChange} min="0" max="100"
                        required placeholder="Discount percentage" />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                    <input type="date" id="expiryDate" name="expiryDate" value={couponData.expiryDate}
                        onChange={handleInputChange} className={styles.input} required />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Create Coupon
                </button>
            </form>
        </div>
    );
};

export default CouponUpload;