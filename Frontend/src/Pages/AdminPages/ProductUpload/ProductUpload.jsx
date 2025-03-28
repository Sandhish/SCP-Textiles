import React, { useState, useRef } from 'react';
import styles from './ProductUpload.module.css';

const ProductUpload = () => {
    const [productData, setProductData] = useState({
        name: '',
        img: null,
        price: '',
        description: '',
        tag: ''
    });

    const fileInputRef = useRef(null);
    const tags = ['bedsheet', 'floor mat', 'towel', 'pillow cover'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProductData(prev => ({
            ...prev,
            img: file
        }));
    };

    const handleImageRemove = () => {
        setProductData(prev => ({
            ...prev,
            img: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Product Data:', productData);
    };

    return (
        <div className={styles.productUploadContainer}>
            <h2 className={styles.pageTitle}>Upload New Product</h2>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Product Name</label>
                    <input type="text" id="name" name="name" value={productData.name} onChange={handleInputChange}
                        className={styles.input} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="img" className={styles.label}>Product Image</label>
                    <input type="file" id="img" name="img" accept="image/*" onChange={handleImageUpload} ref={fileInputRef}
                        className={styles.fileInput} required />
                    <div className={styles.imageUploadWrapper} onClick={() => fileInputRef.current.click()} >
                        {productData.img ? (
                            <>
                                <img src={URL.createObjectURL(productData.img)} alt="Product Preview" className={styles.imagePreview} />
                                <button type="button" className={styles.imageRemoveBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageRemove();
                                    }} >
                                    ✕
                                </button>
                            </>
                        ) : (
                            <div className={styles.imageUploadIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.152-.177a1.56 1.56 0 001.11-.71l.821-1.317a2.685 2.685 0 012.332-1.39zM12 12.75h.008v.008H12v-.008z" clipRule="evenodd" />
                                </svg>
                                <div className={styles.imageUploadText}>
                                    Click to upload product image
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.label}>Price</label>
                    <input type="number" id="price" name="price" value={productData.price} onChange={handleInputChange}
                        className={styles.input} min="0" step="0.01" required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <textarea id="description" name="description" value={productData.description}
                        onChange={handleInputChange} className={styles.textarea} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="tag" className={styles.label}>Product Tag</label>
                    <select id="tag" name="tag" value={productData.tag} onChange={handleInputChange}
                        className={styles.select} required >
                        <option value="">Select a Tag</option>
                        {tags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Upload Product
                </button>
            </form>
        </div>
    );
};

export default ProductUpload;