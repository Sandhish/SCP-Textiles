import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import styles from './Management.module.css';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/productRoutes/coupons`, { withCredentials: true });
            setCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to load coupons', { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditCoupon = (coupon) => {
        const formattedDate = new Date(coupon.expiryDate).toISOString().split('T')[0];
        setCurrentCoupon({ ...coupon, expiryDate: formattedDate });
        setIsModalOpen(true);
    };

    const handleSaveCoupon = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/coupon/update/${currentCoupon._id}`,
                currentCoupon,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 200) {
                toast.success('Coupon updated successfully!', { position: 'top-center' });
                setIsModalOpen(false);
                setCurrentCoupon(null);
                fetchCoupons();
            }
        } catch (error) {
            console.error('Error updating coupon:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update coupon';
            toast.error(errorMessage, { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            setLoading(true);
            try {
                const response = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/coupon/delete/${id}`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    toast.success('Coupon deleted successfully!', { position: 'top-center' });
                    setCoupons(prev => prev.filter(c => c._id !== id));
                }
            } catch (error) {
                console.error('Error deleting coupon:', error);
                toast.error('Failed to delete coupon', { position: 'top-center' });
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const renderCouponModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                            setCurrentCoupon(null);
                        }}
                        className={styles.modalCloseButton} >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-4">
                        Edit Coupon
                    </h2>
                    <form onSubmit={handleSaveCoupon} className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Coupon Code</label>
                            <input type="text" className={styles.formInput} value={currentCoupon?.code || ''} required
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    code: e.target.value.toUpperCase()
                                }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Discount (%)</label>
                            <input type="number" className={styles.formInput} value={currentCoupon?.discount || ''}
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    discount: parseInt(e.target.value)
                                }))}
                                min="0" max="100" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Expiry Date</label>
                            <input type="date" className={styles.formInput} value={currentCoupon?.expiryDate || ''} required
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    expiryDate: e.target.value
                                }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Status</label>
                            <select className={styles.formInput} value={currentCoupon?.isActive ? 'true' : 'false'}
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    isActive: e.target.value === 'true'
                                }))} >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.formSubmitButton} disabled={loading} >
                            {loading ? 'Saving...' : 'Save Coupon'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.managementContainer}>
            <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Coupon Management</h2>
            </div>

            {loading && !isModalOpen && <div className={styles.loadingIndicator}>Loading coupons...</div>}

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount %</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon._id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}%</td>
                                <td>{formatDate(coupon.expiryDate)}</td>
                                <td>{coupon.isActive ? 'Active' : 'Inactive'}</td>
                                <td className={styles.actionCell}>
                                    <button className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() => handleEditCoupon(coupon)} >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDeleteCoupon(coupon._id)} >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className={styles.noData}>No coupons available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {renderCouponModal()}
        </div>
    );
};

export default CouponManagement;