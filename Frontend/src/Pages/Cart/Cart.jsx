import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import styles from './Cart.module.css';
import CheckoutModal from '../../Components/CheckoutModal/CheckoutModal';

const Cart = () => {
    const sampleCartItems = [
        {
            id: 1,
            name: 'Luxury Cotton Bedsheet',
            image: 'https://pepsdreamdecor.in/pepsadmin/pepsindia/public/storage/products/August2021/harmonize%20folded%20double%20bedsheets%20blush%20pink%20zig%20zag.jpg',
            price: 1499,
            quantity: 1,
            color: 'White',
            size: 'King'
        },
        {
            id: 2,
            name: 'Soft Microfiber Floor Mat',
            image: 'https://5.imimg.com/data5/GR/UY/MY-24014740/floor-mat-1000x1000.jpg',
            price: 599,
            quantity: 2,
            color: 'Gray',
            size: 'Medium'
        },
        {
            id: 3,
            name: 'Premium Cotton Towel Set',
            image: 'https://th.bing.com/th/id/OIP.VefLND7RJ6jwnPxoRr5aZAAAAA?rs=1&pid=ImgDetMain',
            price: 799,
            quantity: 1,
            color: 'Blue',
            size: '4-Piece Set'
        },
        {
            id: 4,
            name: 'Soft Pillow Cover',
            image: 'https://th.bing.com/th/id/OIP.xVPQjbZiZBim3kdcWF6p_gHaHa?pid=ImgDet&w=474&h=474&rs=1',
            price: 299,
            quantity: 3,
            color: 'Beige',
            size: 'Standard'
        }
    ];

    const [cartItems, setCartItems] = useState(sampleCartItems);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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
        return couponApplied ? calculateSubtotal() * 0.1 : 0;
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
        setIsCheckoutModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setIsCheckoutModalOpen(false);
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
                    <FaShoppingCart size={80} color="#555" />
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
        <>
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
                                    <p className={styles.productVariant}>Color: {item.color} | Size: {item.size}</p>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.price}>₹{item.price.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className={styles.quantityControls}>
                                    <button className={styles.quantityButton} disabled={item.quantity <= 1}
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)} >
                                        -
                                    </button>
                                    <input type="text" className={styles.quantityInput} value={item.quantity} readOnly />
                                    <button className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity + 1)} >
                                        +
                                    </button>
                                </div>

                                <div className={styles.itemActions}>
                                    <button className={styles.removeButton} onClick={() => removeItem(item.id)} >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className={styles.cartActions}>
                            <button className={styles.continueShoppingButton} onClick={() => window.location.href = '/'} >
                                Continue Shopping
                            </button>
                            <button className={styles.clearCartButton} onClick={() => setCartItems([])} >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    <div className={styles.orderSummary}>
                        <h2>Order Summary</h2>

                        <div className={styles.couponSection}>
                            <div className={styles.couponInput}>
                                <input type="text" placeholder="Enter Coupon Code" value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)} />
                                <button className={styles.applyCouponButton} onClick={applyCoupon} >
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
                                <span className={styles.discountAmount}>- ₹{calculateDiscount().toLocaleString()}</span>
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

                        <button className={styles.checkoutButton} onClick={proceedToCheckout} >
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal isOpen={isCheckoutModalOpen} onClose={closeCheckoutModal} finalTotal={calculateTotal()}
                onSubmit={() => {
                    closeCheckoutModal();
                }}
            />
        </>
    );
};

export default Cart;