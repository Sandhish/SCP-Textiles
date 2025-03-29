import React, { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import styles from './Management.module.css';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([
        { id: 1, code: 'SUMMER20', discount: 20, expiryDate: '2024-08-31' },
        { id: 2, code: 'WINTER10', discount: 10, expiryDate: '2024-12-31' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);

    const handleEditCoupon = (coupon) => {
        setCurrentCoupon({ ...coupon });
        setIsModalOpen(true);
    };

    const handleSaveCoupon = (e) => {
        e.preventDefault();
        if (currentCoupon.id) {
            setCoupons(prev =>
                prev.map(c => c.id === currentCoupon.id ? currentCoupon : c)
            );
        }
        setIsModalOpen(false);
        setCurrentCoupon(null);
    };

    const handleDeleteCoupon = (id) => {
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    const renderCouponModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button onClick={() => {
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
                            <input type="text" className={styles.formInput} value={currentCoupon?.code || ''}
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    code: e.target.value.toUpperCase()
                                }))} required />
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
                            <input type="date" className={styles.formInput} value={currentCoupon?.expiryDate || ''}
                                onChange={(e) => setCurrentCoupon(prev => ({
                                    ...prev,
                                    expiryDate: e.target.value
                                }))}
                                required />
                        </div>
                        <button type="submit" className={styles.formSubmitButton} >
                            Save Coupon
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

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Discount %</th>
                            <th>Expiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td>{coupon.id}</td>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}%</td>
                                <td>{coupon.expiryDate}</td>
                                <td className={styles.actionCell}>
                                    <button className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() => handleEditCoupon(coupon)} >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDeleteCoupon(coupon.id)} >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderCouponModal()}
        </div>
    );
};

export default CouponManagement;