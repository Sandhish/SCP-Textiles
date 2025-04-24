import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import styles from './Management.module.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/productRoutes/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products. Please try again.', {
                position: 'top-center',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEditProduct = (product) => {
        setCurrentProduct({ ...product });
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();

        try {
            const updatedData = {
                name: currentProduct.name,
                price: currentProduct.price,
                quantity: currentProduct.quantity,
                description: currentProduct.description,
                tag: currentProduct.tag
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/update/${currentProduct._id}`,
                updatedData
            );

            setProducts(prev =>
                prev.map(p => p._id === currentProduct._id ? response.data : p)
            );

            toast.success('Product updated successfully!', {
                position: 'top-center',
                duration: 3000
            });

            setIsModalOpen(false);
            setCurrentProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(
                error.response?.data?.message || 'Failed to save product. Please try again.',
                {
                    position: 'top-center',
                    duration: 3000
                }
            );
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/delete/${id}`);
                setProducts(prev => prev.filter(p => p._id !== id));
                toast.success('Product deleted successfully!', {
                    position: 'top-center',
                    duration: 3000
                });
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product. Please try again.', {
                    position: 'top-center',
                    duration: 3000
                });
            }
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
                    <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
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
                            <label className={styles.formLabel}>Quantity</label>
                            <input type="number" className={styles.formInput} value={currentProduct?.quantity || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    quantity: parseInt(e.target.value)
                                }))}
                                min="1" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tag</label>
                            <select className={styles.formSelect} value={currentProduct?.tag || ''}
                                onChange={(e) => setCurrentProduct(prev => ({
                                    ...prev,
                                    tag: e.target.value
                                }))}
                                required>
                                <option value="">Select a Tag</option>
                                <option value="bedsheet">bedsheet</option>
                                <option value="floor mat">floor mat</option>
                                <option value="towel">towel</option>
                                <option value="pillowcover">pillow cover</option>
                                <option value="featured">featured</option>
                            </select>
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
                        <button type="submit" className={styles.formSubmitButton}>Update Product</button>
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

            {loading ? (
                <div className={styles.loading}>Loading products...</div>
            ) : (
                <div className={styles.dataTable}>
                    {products.length === 0 ? (
                        <p className={styles.noData}>No products found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Tag</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id.substring(0, 8)}...</td>
                                        <td>
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={styles.thumbnailImage}
                                                />
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>₹{product.price.toFixed(2)}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.tag}</td>
                                        <td className={styles.actionCell}>
                                            <button className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => handleEditProduct(product)} >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => handleDeleteProduct(product._id)} >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {renderProductModal()}
        </div>
    );
};

export default ProductManagement;