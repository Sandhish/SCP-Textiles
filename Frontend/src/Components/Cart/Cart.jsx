import React, { useState, useEffect } from 'react';
import styles from './Cart.module.css';

const Cart = () => {
    const sampleCartItems = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            image: 'https://via.placeholder.com/120',
            price: 1499,
            quantity: 1,
            seller: 'ElectronicsBazaar',
            discount: 500,
            originalPrice: 1999
        },
        {
            id: 2,
            name: 'Premium Cotton T-Shirt',
            image: 'https://via.placeholder.com/120',
            price: 499,
            quantity: 2,
            seller: 'FashionHub',
            discount: 100,
            originalPrice: 599
        },
        {
            id: 3,
            name: 'Smart Fitness Band',
            image: 'https://via.placeholder.com/120',
            price: 2999,
            quantity: 1,
            seller: 'GadgetWorld',
            discount: 1000,
            originalPrice: 3999
        },
        {
            id: 4,
            name: 'Stainless Steel Water Bottle',
            image: 'https://via.placeholder.com/120',
            price: 399,
            quantity: 3,
            seller: 'HomeEssentials',
            discount: 100,
            originalPrice: 499
        }
    ];

    const [cartItems, setCartItems] = useState(sampleCartItems);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [address, setAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                setTimeout(() => {
                    setCartItems(sampleCartItems);
                    setLoading(false);
                }, 800);
            } catch (err) {
                setError('Failed to fetch cart items');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateDiscount = () => {
        let itemDiscount = cartItems.reduce((total, item) => total + (item.discount * item.quantity), 0);
        let couponDiscount = couponApplied ? calculateSubtotal() * 0.1 : 0;
        return itemDiscount + couponDiscount;
    };

    const calculateTax = () => {
        return (calculateSubtotal() - calculateDiscount()) * 0.18; 
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount() + calculateTax() + 40; 
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            setError('Failed to update quantity');
        }
    };

    const removeItem = (itemId) => {
        try {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    const applyCoupon = () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        try {
            const validCoupons = ['SAVE10', 'WELCOME20', 'DISCOUNT'];

            if (validCoupons.includes(couponCode.toUpperCase())) {
                setCouponApplied(true);
                setError(null);
            } else {
                setCouponApplied(false);
                setError('Invalid coupon code');
            }
        } catch (err) {
            setError('Invalid coupon code');
        }
    };

    const proceedToCheckout = () => {
        try {
            alert('Checkout successful! Order total: ₹' + calculateTotal().toFixed(2));
        } catch (err) {
            setError('Checkout failed');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error && error !== 'Invalid coupon code') {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <button className={styles.retryButton} onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className={styles.emptyCartContainer}>
                <div className={styles.emptyCartImage}>
                    <img src="https://via.placeholder.com/200?text=Empty+Cart" alt="Empty Cart" />
                </div>
                <h2>Your cart is empty!</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button className={styles.continueShopping} onClick={() => window.location.href = '/'}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartHeader}>
                <h1>Shopping Cart ({cartItems.length} items)</h1>
            </div>

            <div className={styles.cartContent}>
                <div className={styles.cartItemsContainer}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.productImage}>
                                <img src={item.image} alt={item.name} />
                            </div>

                            <div className={styles.productDetails}>
                                <h3 className={styles.productName}>{item.name}</h3>
                                <p className={styles.sellerInfo}>Sold by: {item.seller}</p>

                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>₹{item.price.toLocaleString()}</span>
                                    {item.originalPrice > item.price && (
                                        <span className={styles.originalPrice}>₹{item.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.quantityControls}>
                                <button
                                    className={styles.quantityButton}
                                    disabled={item.quantity <= 1}
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    className={styles.quantityInput}
                                    value={item.quantity}
                                    readOnly
                                />
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <div className={styles.itemActions}>
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className={styles.cartActions}>
                        <button
                            className={styles.continueShoppingButton}
                            onClick={() => window.location.href = '/'}
                        >
                            Continue Shopping
                        </button>
                        <button
                            className={styles.clearCartButton}
                            onClick={() => setCartItems([])}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <h2>Order Summary</h2>

                    <div className={styles.couponSection}>
                        <div className={styles.couponInput}>
                            <input
                                type="text"
                                placeholder="Enter Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                                className={styles.applyCouponButton}
                                onClick={applyCoupon}
                            >
                                Apply
                            </button>
                        </div>
                        {error === 'Invalid coupon code' && (
                            <p className={styles.errorMessage}>{error}</p>
                        )}
                        {couponApplied && (
                            <p className={styles.successMessage}>Coupon applied successfully!</p>
                        )}
                    </div>

                    <div className={styles.priceDetails}>
                        <h3>Price Details</h3>

                        <div className={styles.priceRow}>
                            <span>Price ({cartItems.length} items)</span>
                            <span>₹{calculateSubtotal().toLocaleString()}</span>
                        </div>

                        <div className={styles.priceRow}>
                            <span>Discount</span>
                            <span className={styles.discountAmount}>-₹{calculateDiscount().toLocaleString()}</span>
                        </div>

                        <div className={styles.priceRow}>
                            <span>Delivery Charges</span>
                            <span>₹40</span>
                        </div>

                        <div className={styles.priceRow}>
                            <span>GST</span>
                            <span>₹{calculateTax().toFixed(2)}</span>
                        </div>

                        <div className={styles.totalRow}>
                            <span>Total Amount</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>

                        <div className={styles.savingsRow}>
                            <span>You will save ₹{calculateDiscount().toLocaleString()} on this order</span>
                        </div>
                    </div>

                    <button
                        className={styles.checkoutButton}
                        onClick={proceedToCheckout}
                    >
                        Proceed to Checkout
                    </button>

                    <div className={styles.securePayment}>
                        <span className={styles.secureIcon}>🔒</span>
                        <span>100% Secure Payments</span>
                    </div>

                    <div className={styles.paymentMethods}>
                        <span>We Accept:</span>
                        <div className={styles.paymentIcons}>
                            <div className={styles.paymentIcon}>💳</div>
                            <div className={styles.paymentIcon}>💵</div>
                            <div className={styles.paymentIcon}>💰</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;