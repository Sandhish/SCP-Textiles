import React, { useState } from 'react';
import { Edit, Trash2, X, Upload } from 'lucide-react';
import styles from './Management.module.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Premium Cotton Bedsheet',
            price: 19.99,
            tag: 'bedsheet',
            description: 'Soft, breathable 100% cotton bedsheet',
            image: null
        },
        {
            id: 2,
            name: 'Luxury Turkish Towel',
            price: 29.99,
            tag: 'towel',
            description: 'Ultra-absorbent Turkish cotton towel',
            image: null
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleEditProduct = (product) => {
        setCurrentProduct({ ...product });
        setIsModalOpen(true);
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (currentProduct.id) {
            setProducts(prev =>
                prev.map(p => p.id === currentProduct.id ? currentProduct : p)
            );
        }
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleDeleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentProduct(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderProductModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button onClick={() => {
                            setIsModalOpen(false);
                            setCurrentProduct(null);
                        }}
                        className={styles.modalCloseButton} >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-4">
                        Edit Product
                    </h2>
                    <form onSubmit={handleSaveProduct} className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input type="text" className={styles.formInput} value={currentProduct?.name || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Price</label>
                            <input type="number" className={styles.formInput} value={currentProduct?.price || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    price: parseFloat(e.target.value)
                                }))}
                                step="0.01" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tag</label>
                            <input type="text" className={styles.formInput} value={currentProduct?.tag || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    tag: e.target.value
                                }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea className={styles.formTextarea} value={currentProduct?.description || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                required />
                        </div>
                        <div className={styles.imageUploadContainer}>
                            {currentProduct?.image && (
                                <img src={currentProduct.image} alt="Product Preview" className={styles.imagePreview} />
                            )}
                            <input type="file" id="productImage" className={styles.fileInput} accept="image/*" onChange={handleImageUpload} />
                            <label htmlFor="productImage" className={styles.fileInputLabel}>
                                <Upload size={20} /> Upload Image
                            </label>
                        </div>
                        <button type="submit" className={styles.formSubmitButton} >
                            Save Product
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.managementContainer}>
            <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Product Management</h2>
            </div>

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Tag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.tag}</td>
                                <td className={styles.actionCell}>
                                    <button className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() => handleEditProduct(product)} >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDeleteProduct(product.id)}  >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderProductModal()}
        </div>
    );
};

export default ProductManagement;