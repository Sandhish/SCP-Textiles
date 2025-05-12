import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/authRoutes/admin/getUsers`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users. Please try again.",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to get user details by ID
  const getUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/authRoutes/admin/getUsersById/${userId}`
      );
      setSelectedUser(response.data);

      // Fetch purchased products if any
      if (
        response.data.purchasedProduts &&
        response.data.purchasedProduts.length > 0
      ) {
        fetchPurchasedProducts(response.data.purchasedProduts);
      } else {
        setPurchasedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch user details. Please try again.",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch purchased products details
  const fetchPurchasedProducts = async (productIds) => {
    setLoadingProducts(true);
    try {
      // Using the existing getProductsByIds endpoint with comma-separated IDs
      const idsString = productIds.join(",");
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/productRoutes/products/getProductsByIds?ids=${idsString}`
      );
      setPurchasedProducts(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch product details. Please try again.",
        {
          position: "top-center",
          duration: 3000,
        }
      );
      setPurchasedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/authRoutes/admin/deleteUser/${userId}`
      );

      // Remove user from the state
      setUsers(users.filter((user) => user._id !== userId));

      // Reset selected user if deleted
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
        setPurchasedProducts([]);
      }

      toast.success("User deleted successfully!", {
        position: "top-center",
        duration: 3000,
      });

      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user. Please try again.",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open confirmation modal
  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className={styles.userManagementContainer}>
      <h2 className={styles.pageTitle}>User Management</h2>

      {/* Search bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {/* User list */}
      <div className={styles.userListContainer}>
        <h3 className={styles.sectionTitle}>All Users</h3>

        {loading && <div className={styles.loadingSpinner}>Loading...</div>}

        {!loading && filteredUsers.length === 0 && (
          <p className={styles.noResults}>No users found.</p>
        )}

        {!loading && filteredUsers.length > 0 && (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "User"}</td>
                  <td>{user.purchasedProduts?.length || 0}</td>
                  <td className={styles.actionButtons}>
                    <button
                      className={styles.viewButton}
                      onClick={() => getUserDetails(user._id)}
                    >
                      View
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => openConfirmModal(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User details panel */}
      {selectedUser && (
        <div className={styles.userDetailsPanel}>
          <h3 className={styles.sectionTitle}>User Details</h3>
          <div className={styles.userDetails}>
            <div className={styles.detailGroup}>
              <span className={styles.detailLabel}>ID:</span>
              <span className={styles.detailValue}>{selectedUser._id}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.detailLabel}>Name:</span>
              <span className={styles.detailValue}>{selectedUser.name}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{selectedUser.email}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.detailLabel}>Role:</span>
              <span className={styles.detailValue}>
                {selectedUser.role || "User"}
              </span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.detailLabel}>Joined:</span>
              <span className={styles.detailValue}>
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Purchased Products Section */}
            <div className={styles.purchasedProductsSection}>
              <h4 className={styles.subSectionTitle}>Purchased Products</h4>

              {loadingProducts && (
                <div className={styles.loadingText}>Loading products...</div>
              )}

              {!loadingProducts &&
                (!selectedUser.purchasedProduts ||
                  selectedUser.purchasedProduts.length === 0) && (
                  <p className={styles.noProducts}>No purchased products.</p>
                )}

              {!loadingProducts &&
                selectedUser.purchasedProduts &&
                selectedUser.purchasedProduts.length > 0 && (
                  <div className={styles.productsList}>
                    {purchasedProducts.length > 0 ? (
                      <table className={styles.productsTable}>
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchasedProducts.map((product) => (
                            <tr key={product._id}>
                              <td>{product.name}</td>
                              <td>${product.price?.toFixed(2) || "N/A"}</td>
                              <td>{product.category || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className={styles.productsLoading}>
                        Loading product details...
                      </p>
                    )}
                  </div>
                )}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => {
                setSelectedUser(null);
                setPurchasedProducts([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <h4>Confirm Delete</h4>
            <p>
              Are you sure you want to delete the user:{" "}
              <strong>{selectedUser.name}</strong>?
            </p>
            <p className={styles.warningText}>This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={closeConfirmModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => deleteUser(selectedUser._id)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
