import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./AddReview.module.css";

const AddReview = ({ isOpen, onClose, productId, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    review: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.customerName.trim())
      newErrors.customerName = "Name is required";
    if (!formData.review.trim()) newErrors.review = "Review text is required";
    if (formData.rating === 0) newErrors.rating = "Please select a rating";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/review`,
        {
          ...formData,
          product: productId,
        },
        { withCredentials: true }
      );

      toast.success("Review submitted successfully!");
      if (onReviewAdded) {
        onReviewAdded();
      }
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        toast.error("Please login to submit a review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingClick(i)}
          className={styles.starIcon}
        >
          {i <= formData.rating ? (
            <FaStar className={styles.filledStar} />
          ) : (
            <FaRegStar />
          )}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Write a Review</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoMdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.formGroup}>
            <label htmlFor="customerName">Your Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.customerName ? styles.inputError : ""}
            />
            {errors.customerName && (
              <span className={styles.errorText}>{errors.customerName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Review Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Summarize your review"
              className={errors.title ? styles.inputError : ""}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Rating</label>
            <div className={styles.ratingContainer}>{renderStars()}</div>
            {errors.rating && (
              <span className={styles.errorText}>{errors.rating}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="review">Review</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Write your detailed review here"
              rows="5"
              className={errors.review ? styles.inputError : ""}
            />
            {errors.review && (
              <span className={styles.errorText}>{errors.review}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
