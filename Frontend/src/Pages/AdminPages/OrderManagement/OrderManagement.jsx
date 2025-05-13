import React, { useState, useEffect } from "react";
import { Filter, Eye, Truck, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./OrderManagement.module.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const orderStatuses = [
    "all",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/payment/all-orders`
      );
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === selectedStatus)
      );
    }
  }, [selectedStatus, orders]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || "");
    setIsUpdateModalOpen(true);
  };

  const handleSaveStatus = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/payment/update-order-status`,
        {
          orderId: currentOrder._id,
          orderStatus: newStatus,
          trackingNumber: trackingNumber || undefined,
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === currentOrder._id ? response.data : o))
      );

      toast.success("Order status updated successfully!");
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "processing":
        return styles.statusProcessing;
      case "shipped":
        return styles.statusShipped;
      case "delivered":
        return styles.statusDelivered;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return styles.paymentPaid;
      case "pending":
        return styles.paymentPending;
      case "failed":
        return styles.paymentFailed;
      default:
        return "";
    }
  };

  const renderOrderDetailModal = () => {
    if (!isDetailModalOpen || !currentOrder) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className={styles.modalCloseButton}
          >
            <X size={24} />
          </button>

          <h2 className={styles.modalTitle}>Order Details</h2>
          <div className={styles.detailHeader}>
            <div className={styles.orderNumber}>
              <span>Order #:</span> {currentOrder.orderNumber}
            </div>
            <div className={styles.orderDate}>
              <span>Date:</span> {formatDate(currentOrder.createdAt)}
            </div>
          </div>

          <div className={styles.statusContainer}>
            <div
              className={`${styles.statusBadge} ${getStatusBadgeClass(
                currentOrder.orderStatus
              )}`}
            >
              {currentOrder.orderStatus.charAt(0).toUpperCase() +
                currentOrder.orderStatus.slice(1)}
            </div>
            <div
              className={`${styles.statusBadge} ${getPaymentStatusBadgeClass(
                currentOrder.paymentStatus
              )}`}
            >
              Payment:{" "}
              {currentOrder.paymentStatus.charAt(0).toUpperCase() +
                currentOrder.paymentStatus.slice(1)}
            </div>
          </div>

          {currentOrder.trackingNumber && (
            <div className={styles.trackingInfo}>
              <span>Tracking #:</span> {currentOrder.trackingNumber}
            </div>
          )}

          <div className={styles.sectionTitle}>Customer Information</div>
          <div className={styles.customerDetails}>
            <p>
              <strong>Name:</strong> {currentOrder.shippingDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {currentOrder.shippingDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {currentOrder.shippingDetails.phone}
            </p>
          </div>

          <div className={styles.sectionTitle}>Shipping Address</div>
          <div className={styles.addressDetails}>
            <p>{currentOrder.shippingDetails.address}</p>
            <p>
              {currentOrder.shippingDetails.city},{" "}
              {currentOrder.shippingDetails.state}{" "}
              {currentOrder.shippingDetails.pincode}
            </p>
          </div>

          <div className={styles.sectionTitle}>Order Items</div>
          <div className={styles.orderItems}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.products.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product.name}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.totalAmount}>
              <span>Total Amount:</span>
              <span className={styles.amount}>
                ₹{currentOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              className={styles.updateButton}
              onClick={() => {
                setIsDetailModalOpen(false);
                handleUpdateStatus(currentOrder);
              }}
            >
              Update Status
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUpdateStatusModal = () => {
    if (!isUpdateModalOpen || !currentOrder) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className={styles.modalCloseButton}
          >
            <X size={24} />
          </button>

          <h2 className={styles.modalTitle}>Update Order Status</h2>
          <div className={styles.orderIdentifier}>
            Order #{currentOrder.orderNumber}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Order Status</label>
            <select
              className={styles.formSelect}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {(newStatus === "shipped" || newStatus === "delivered") && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tracking Number</label>
              <input
                type="text"
                className={styles.formInput}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          )}

          <div className={styles.modalActions}>
            <button className={styles.saveButton} onClick={handleSaveStatus}>
              Save Changes
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.managementContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Order Management</h2>
        <div className={styles.filterContainer}>
          <Filter size={18} className={styles.filterIcon} />
          <select
            className={styles.statusFilter}
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Orders"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : (
        <div className={styles.dataTable}>
          {filteredOrders.length === 0 ? (
            <p className={styles.noData}>
              No orders found for the selected status.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.shippingDetails.name}</td>
                    <td>
                      {order.products.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>
                    <td>₹{order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          styles.statusBadge
                        } ${getPaymentStatusBadgeClass(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.updateButton}`}
                        onClick={() => handleUpdateStatus(order)}
                      >
                        <Truck size={16} /> Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {renderOrderDetailModal()}
      {renderUpdateStatusModal()}
    </div>
  );
};

export default OrderManagement;
