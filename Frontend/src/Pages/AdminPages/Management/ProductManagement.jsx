import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Upload, Filter } from 'lucide-react';
import styles from './Management.module.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');

    const tags = ['all', 'bedsheet', 'floormat', 'towel', 'pillowcover', 'featured'];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/productRoutes/products`);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedTag === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.tag === selectedTag));
        }
    }, [selectedTag, products]);

    const handleTagChange = (tag) => {
        setSelectedTag(tag);
    };

    const handleEditProduct = (product) => {
        setCurrentProduct({ ...product });
        setImagePreview(product.image || '');
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();

        try {
            let updatedData = {
                name: currentProduct.name,
                price: currentProduct.price,
                quantity: currentProduct.quantity,
                description: currentProduct.description,
                tag: currentProduct.tag
            };

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const imageResponse = await axios.post(
                    `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/upload-image/${currentProduct._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                updatedData.image = imageResponse.data.imageUrl;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/update/${currentProduct._id}`,
                updatedData
            );

            setProducts(prev =>
                prev.map(p => p._id === currentProduct._id ? response.data : p)
            );

            toast.success('Product updated successfully!');

            setIsModalOpen(false);
            setCurrentProduct(null);
            setImageFile(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product. Please try again.');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/productRoutes/product/delete/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
            toast.success('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product. Please try again.');
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
                        setImageFile(null);
                        setImagePreview('');
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
                            <label className={styles.formLabel}>Product Image</label>
                            <div className={styles.imageUploadContainer}>
                                {imagePreview && (
                                    <div className={styles.imagePreviewWrapper}>
                                        <img src={imagePreview} alt="Product preview" className={styles.imagePreview} />
                                    </div>
                                )}
                                <div className={styles.uploadButtonWrapper}>
                                    <label className={styles.uploadButton}>
                                        <Upload size={18} className={styles.uploadIcon} />
                                        <span>Choose Image</span>
                                        <input type="file" accept="image/*" className={styles.fileInput} onChange={handleImageChange} />
                                    </label>
                                    {imageFile && <span className={styles.fileName}>{imageFile.name}</span>}
                                </div>
                            </div>
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
                                <option value="floormat">floor mat</option>
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
                <div className={styles.filterContainer}>
                    <Filter size={18} className={styles.filterIcon} />
                    <select
                        className={styles.tagFilter}
                        value={selectedTag}
                        onChange={(e) => handleTagChange(e.target.value)}
                    >
                        {tags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag === 'all' ? 'All Products' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading products...</div>
            ) : (
                <div className={styles.dataTable}>
                    {filteredProducts.length === 0 ? (
                        <p className={styles.noData}>No products found for the selected tag.</p>
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
                                {filteredProducts.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id.substring(0, 8)}...</td>
                                        <td>
                                            {product.image && (
                                                <img src={product.image} alt={product.name} className={styles.thumbnailImage} />
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