import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './CouponUpload.module.css';
import axios from 'axios';

const CouponUpload = () => {
    const [couponData, setCouponData] = useState({
        code: '',
        discount: '',
        expiryDate: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/coupon/create`,
                couponData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 201) {
                toast.success('Coupon created successfully!', {
                    position: 'top-center',
                    duration: 3000
                });
                setCouponData({
                    code: '',
                    discount: '',
                    expiryDate: ''
                });
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create coupon';
            toast.error(errorMessage, {
                position: 'top-center',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
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
                    <label htmlFor="discount" className={styles.label}>Discount Percentage</label>
                    <input type="number" id="discount" name="discount" className={styles.input} value={couponData.discount}
                        onChange={handleInputChange} min="0" max="100" required placeholder="Discount percentage" />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                    <input type="date" id="expiryDate" name="expiryDate" value={couponData.expiryDate} onChange={handleInputChange}
                        className={styles.input} required />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading} >
                    {loading ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
};

export default CouponUpload;