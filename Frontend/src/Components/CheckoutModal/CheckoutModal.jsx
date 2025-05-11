import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import styles from './CheckoutModal.module.css';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Qx9jbQV0ALkosDI0adW25M4CBYipK9fBtZALtl1IMzQSiWvJJsXicOjioYb99cauGDand2uCiC9vIifjqggid4M00T7LUmGmo');

const CheckoutForm = ({ currentStep, formData, setFormData, errors, setErrors, handleSubmit, finalTotal, couponApplied, calculateSubtotal, calculateDiscount, calculateTax, goBack, stripe, elements, clientSecret, processing, setProcessing, succeeded, setSucceeded, error, setError }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const subtotal = typeof calculateSubtotal === 'function' ? calculateSubtotal() : 0;
    const discount = typeof calculateDiscount === 'function' ? calculateDiscount() : 0;
    const tax = typeof calculateTax === 'function' ? calculateTax() : 0;

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: formData.name,
                    email: formData.email,
                    address: {
                        line1: formData.address,
                        city: formData.city,
                        state: formData.state,
                        postal_code: formData.pincode,
                        country: 'IN',
                    },
                },
            },
        });

        if (payload.error) {
            setError(`Payment failed: ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            try {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_API}/api/payment/update-purchase-history`,
                    {
                        paymentIntent: payload.paymentIntent.id,
                        shippingDetails: formData
                    },
                    { withCredentials: true }
                );

                handleSubmit(e, payload.paymentIntent);
            } catch (err) {
                console.error("Error updating purchase history:", err);
            }
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={currentStep === 3 ? handlePaymentSubmit : handleSubmit} className={styles.checkoutForm}>
            {currentStep === 1 && (
                <div className={styles.shippingDetails}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? styles.inputError : ''}
                        />
                        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className={errors.phone ? styles.inputError : ''}
                            />
                            {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className={errors.address ? styles.inputError : ''}
                        />
                        {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={errors.city ? styles.inputError : ''}
                            />
                            {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={errors.state ? styles.inputError : ''}
                            />
                            {errors.state && <span className={styles.errorMessage}>{errors.state}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="pincode">Pincode</label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                maxLength={6}
                                className={errors.pincode ? styles.inputError : ''}
                            />
                            {errors.pincode && <span className={styles.errorMessage}>{errors.pincode}</span>}
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className={styles.orderConfirmation}>
                    <div className={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryItem}>
                            <span>Shipping to:</span>
                            <p>{formData.name}</p>
                            <p>{formData.address}</p>
                            <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                            <p>Phone: {formData.phone}</p>
                        </div>

                        <div className={styles.priceBreakdown}>
                            <div className={styles.priceRow}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            {couponApplied && (
                                <div className={styles.priceRow}>
                                    <span>Discount</span>
                                    <span className={styles.discountAmount}>- ₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className={styles.priceRow}>
                                <span>GST (18%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className={styles.priceRow}>
                                <span>Delivery Charges</span>
                                <span>₹40.00</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total Amount</span>
                                <span className={styles.amount}>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.paymentStep}>
                    <h3 className={styles.paymentHeader}>Payment Information</h3>

                    <div className={styles.cardElementContainer}>
                        <CardElement options={cardElementOptions} />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {processing && <div className={styles.processingMessage}>Processing your payment...</div>}

                    {succeeded && (
                        <div className={styles.successMessage}>
                            <div className={styles.checkmark}>✓</div>
                            Payment successful! Processing your order...
                        </div>
                    )}
                </div>
            )}

            <div className={styles.formActions}>
                <button type="button" className={styles.backButton} onClick={goBack} disabled={processing}>
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                    type="submit"
                    className={styles.continueButton}
                    disabled={currentStep === 3 && (processing || !stripe || succeeded)}
                >
                    {currentStep === 1 ? 'Continue' : currentStep === 2 ? 'Proceed to Payment' :
                        processing ? 'Processing...' : succeeded ? 'Payment Successful' : `Pay ₹${finalTotal.toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

const CheckoutModal = ({ isOpen, onClose, finalTotal, calculateSubtotal = () => 0, calculateDiscount = () => 0, calculateTax = () => 0, couponApplied, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentStep === 3) {
            const createPaymentIntent = async () => {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_BACKEND_API}/api/payment/create-payment-intent`,
                        {
                            amount: finalTotal,
                            shippingDetails: formData
                        },
                        { withCredentials: true }
                    );
                    setClientSecret(response.data.clientSecret);
                } catch (err) {
                    setError(`Payment setup failed: ${err.message}`);
                }
            };

            createPaymentIntent();
        }
    }, [currentStep, finalTotal, formData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e, paymentIntent = null) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (validateForm()) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            setCurrentStep(3);
        } else if (currentStep === 3 && paymentIntent) {
            handlePaymentSuccess(paymentIntent);
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            console.log("Payment successful, creating order...");

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/payment/create`,
                {
                    shippingDetails: formData,
                    paymentIntentId: paymentIntent.id,
                    amount: finalTotal,
                },
                { withCredentials: true }
            );

            console.log("Order created successfully:", response.data);
            const orderId = response.data.orderId;
            setOrderId(orderId);
            setOrderComplete(true);

            try {
                await axios.delete(
                    `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/cart/clear`,
                    { withCredentials: true }
                );
                console.log("Cart cleared successfully");
            } catch (cartErr) {
                console.error("Error clearing cart:", cartErr);
            }

            onSubmit();
            navigate(`/order/${orderId}`);
        } catch (err) {
            console.error("Error creating order:", err);
            setError("Failed to process your order. Please try again.");
        }
    };

    const goBack = () => {
        if (currentStep === 1) {
            onClose();
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isOpen) return null;

    if (orderComplete) {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2>Order Successful!</h2>
                    </div>
                    <div className={styles.orderSuccessContent}>
                        <div className={styles.successIcon}>✓</div>
                        <h3>Thank you for your purchase!</h3>
                        <p>Your order has been placed successfully.</p>
                        <p>Order ID: <strong>{orderId}</strong></p>
                        <p>We have sent a confirmation email to <strong>{formData.email}</strong></p>
                        <p>You will be redirected to order details shortly...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2>
                        {currentStep === 1
                            ? 'Shipping Details'
                            : currentStep === 2
                                ? 'Order Confirmation'
                                : 'Payment'}
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${currentStep >= 1 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>1</div>
                        <span>Shipping</span>
                    </div>
                    <div className={styles.stepDivider}></div>
                    <div className={`${styles.step} ${currentStep >= 2 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>2</div>
                        <span>Confirmation</span>
                    </div>
                    <div className={styles.stepDivider}></div>
                    <div className={`${styles.step} ${currentStep >= 3 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>3</div>
                        <span>Payment</span>
                    </div>
                </div>

                {currentStep === 3 ? (
                    <Elements stripe={stripePromise}>
                        <CheckoutElementsWrapper
                            currentStep={currentStep}
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            setErrors={setErrors}
                            handleSubmit={handleSubmit}
                            finalTotal={finalTotal}
                            couponApplied={couponApplied}
                            calculateSubtotal={calculateSubtotal}
                            calculateDiscount={calculateDiscount}
                            calculateTax={calculateTax}
                            goBack={goBack}
                            clientSecret={clientSecret}
                            processing={processing}
                            setProcessing={setProcessing}
                            succeeded={succeeded}
                            setSucceeded={setSucceeded}
                            error={error}
                            setError={setError}
                        />
                    </Elements>
                ) : (
                    <CheckoutForm
                        currentStep={currentStep}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors}
                        handleSubmit={handleSubmit}
                        finalTotal={finalTotal}
                        couponApplied={couponApplied}
                        calculateSubtotal={calculateSubtotal}
                        calculateDiscount={calculateDiscount}
                        calculateTax={calculateTax}
                        goBack={goBack}
                        processing={processing}
                        succeeded={succeeded}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
};

const CheckoutElementsWrapper = (props) => {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <CheckoutForm
            {...props}
            stripe={stripe}
            elements={elements}
        />
    );
};

export default CheckoutModal;