import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import styles from "./OrderSuccess.module.css";
import { FaCheckCircle, FaHome, FaBoxOpen } from "react-icons/fa";

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching order details for:", orderNumber);
        
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/payment/${orderNumber}`,
          { withCredentials: true }
        );

        console.log("Order details response:", response.data);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to load order details. Please try again later.");
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setError("Invalid order number");
      setLoading(false);
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <Link to="/" className={styles.homeLink}>
          Return to Home
        </Link>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className={styles.errorContainer}>
        <p>Order details not found</p>
        <Link to="/" className={styles.homeLink}>
          Return to Home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className={styles.thankYouMessage}>
          Thank you for your purchase. We've received your order and it's being processed.
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.orderInfoItem}>
            <span>Order Number:</span>
            <strong>{orderDetails.orderNumber}</strong>
          </div>

          <div className={styles.orderInfoItem}>
            <span>Order Date:</span>
            <strong>{formatDate(orderDetails.createdAt)}</strong>
          </div>

          <div className={styles.orderInfoItem}>
            <span>Total Amount:</span>
            <strong>₹{orderDetails.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className={styles.productsSection}>
          <h3>Ordered Products</h3>
          {orderDetails.products && orderDetails.products.length > 0 ? (
            <div className={styles.productsList}>
              {orderDetails.products.map((item, index) => (
                <div key={index} className={styles.productItem}>
                  <div className={styles.productImage}>
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} />
                    ) : (
                      <div className={styles.noImage}>
                        <FaBoxOpen />
                      </div>
                    )}
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{item.product.name}</h4>
                    <div className={styles.productMeta}>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No product details available</p>
          )}
        </div>

        <div className={styles.shippingDetails}>
          <h3>Shipping Details</h3>
          <p>{orderDetails.shippingDetails.name}</p>
          <p>{orderDetails.shippingDetails.address}</p>
          <p>
            {orderDetails.shippingDetails.city}, {orderDetails.shippingDetails.state} -
            {orderDetails.shippingDetails.pincode}
          </p>
          <p>Phone: {orderDetails.shippingDetails.phone}</p>
        </div>

        <p className={styles.emailMessage}>
          We've sent a confirmation email to <strong>{orderDetails.shippingDetails.email}</strong> with all the details.
        </p>

        <div className={styles.actionButtons}>
          <Link to="/" className={styles.continueShopping}>
            <FaHome /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;