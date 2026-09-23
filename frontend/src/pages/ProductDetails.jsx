import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { getProductImage } from "../assets/products/productImages";

function ProductDetails() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [ratingDistribution, setRatingDistribution] = useState([]);

  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  // =========================================================
  // CURRENT USER
  // =========================================================

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("token")) {
        return;
      }

      try {
        const response = await api.get("/api/users/me");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // =========================================================
  // EDIT REVIEW
  // =========================================================

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [editingComment, setEditingComment] = useState("");
  const [editingReviewLoading, setEditingReviewLoading] = useState(false);

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const [deletingReviewId, setDeletingReviewId] = useState(null);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    try {
      await api.post("/api/cart/items", {
        productId: product.id,
        quantity: quantity,
      });

      alert("Product added to cart!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    }
  };

  // =========================================================
  // WISHLIST
  // =========================================================

  const handleWishlist = async () => {
    try {
      setWishlistLoading(true);

      if (product.isWishlisted) {
        await api.delete(`/api/wishlist/items/${product.id}`);

        setProduct((currentProduct) => ({
          ...currentProduct,
          isWishlisted: false,
        }));
      } else {
        await api.post(`/api/wishlist/items/${product.id}`);

        setProduct((currentProduct) => ({
          ...currentProduct,
          isWishlisted: true,
        }));
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/api/products/${id}`);

        setProduct(response.data);
      } catch (error) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await api.get(
        `/api/reviews/product/${id}`
      );

      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // =========================================================
  // FETCH RATING DISTRIBUTION
  // =========================================================

  const fetchRatingDistribution = async () => {
    try {
      const response = await api.get(
        `/api/reviews/product/${id}/distribution`
      );

      setRatingDistribution(response.data);
    } catch (error) {
      console.error(
        "Failed to load rating distribution:",
        error
      );
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchRatingDistribution();
  }, [id]);

  // =========================================================
  // REFRESH PRODUCT
  // =========================================================

  const refreshProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to refresh product:", error);
    }
  };

  // =========================================================
  // SUBMIT NEW REVIEW
  // =========================================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    setReviewMessage("");
    setReviewError("");

    if (!localStorage.getItem("token")) {
      setReviewError("Please login to write a review.");
      return;
    }

    if (selectedRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    try {
      setReviewSubmitting(true);

      await api.post("/api/reviews", {
        productId: Number(id),
        rating: selectedRating,
        comment: reviewComment.trim(),
      });

      setReviewMessage(
        "Your review has been submitted successfully."
      );

      setSelectedRating(0);
      setReviewComment("");

      await fetchReviews();
      await fetchRatingDistribution();
      await refreshProduct();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          "Failed to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =========================================================
  // START EDITING REVIEW
  // =========================================================

  const handleStartEdit = (review) => {
    setEditingReviewId(review.reviewId);
    setEditingRating(review.rating);
    setEditingComment(review.comment);

    setReviewMessage("");
    setReviewError("");
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingRating(0);
    setEditingComment("");
  };

  // =========================================================
  // UPDATE REVIEW
  // =========================================================

  const handleUpdateReview = async (reviewId) => {
    setReviewMessage("");
    setReviewError("");

    if (editingRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    if (!editingComment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    try {
      setEditingReviewLoading(true);

      await api.put(`/api/reviews/${reviewId}`, {
        productId: Number(id),
        rating: editingRating,
        comment: editingComment.trim(),
      });

      setReviewMessage(
        "Your review has been updated successfully."
      );

      setEditingReviewId(null);
      setEditingRating(0);
      setEditingComment("");

      await fetchReviews();
      await fetchRatingDistribution();
      await refreshProduct();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          "Failed to update your review."
      );
    } finally {
      setEditingReviewLoading(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setReviewMessage("");
    setReviewError("");
    setDeletingReviewId(reviewId);

    try {
      await api.delete(`/api/reviews/${reviewId}`);

      setReviewMessage(
        "Your review has been deleted successfully."
      );

      await fetchReviews();
      await fetchRatingDistribution();
      await refreshProduct();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          "Failed to delete your review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="container py-5 text-center">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="container py-5 text-center">
          <p className="text-danger">
            {error || "Product not found."}
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // RATING HELPERS
  // =========================================================

  const getRatingCount = (rating) => {
    const item = ratingDistribution.find(
      (distribution) => distribution.rating === rating
    );

    return item ? item.count : 0;
  };

  const totalReviews = reviews.length;

  const getRatingPercentage = (rating) => {
    if (totalReviews === 0) {
      return 0;
    }

    return Math.round(
      (getRatingCount(rating) / totalReviews) * 100
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="product-details-page">

      {/* ================================================= */}
      {/* PRODUCT DETAILS */}
      {/* ================================================= */}

      <section className="product-details-section py-5">
        <div className="container">

          <div className="row g-5 align-items-center">

            {/* PRODUCT IMAGE */}

            <div className="col-lg-6">
              <div className="product-details-image">

                {getProductImage(product.name) ? (
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="product-details-image-real"
                  />
                ) : (
                  <div className="product-details-placeholder">
                    🛍️
                  </div>
                )}

              </div>
            </div>

            {/* PRODUCT INFORMATION */}

            <div className="col-lg-6">

              <span className="product-category">
                {product.categoryName || "Uncategorized"}
              </span>

              <h1 className="product-details-title">
                {product.name}
              </h1>

              <div className="product-details-rating">

                <span className="rating-stars">
                  ⭐⭐⭐⭐⭐
                </span>

                <span>
                  {Number(
                    product.averageRating || 0
                  ).toFixed(1)}{" "}
                  (
                  {product.reviewCount || 0} Reviews)
                </span>

              </div>

              <h2 className="product-details-price">
                ₹
                {(
                  Number(product.price) * quantity
                ).toLocaleString("en-IN")}
              </h2>

              <p className="product-details-description">
                {product.description}
              </p>

              <div className="product-stock">

                <span className="stock-dot"></span>

                {product.stock > 0
                  ? "In Stock"
                  : "Out of Stock"}

              </div>

              <hr />

              <div className="quantity-section">

                <label>Quantity</label>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (current) => current + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="product-actions">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  🛒 Add to Cart
                </button>

                <button
                  type="button"
                  className={`btn ${
                    product.isWishlisted
                      ? "wishlist-detail-active"
                      : "btn-outline-dark"
                  }`}
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={
                    product.isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {wishlistLoading
                    ? "..."
                    : product.isWishlisted
                    ? "♥"
                    : "♡"}
                </button>

              </div>

              <button
                type="button"
                className="buy-now-btn"
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* ================================================= */}
      {/* REVIEWS */}
      {/* ================================================= */}

      <section className="product-reviews-section">

        <div className="container">

          <div className="reviews-heading">

            <span className="reviews-badge">
              CUSTOMER FEEDBACK
            </span>

            <h2>Customer Reviews</h2>

            <p>
              See what customers have to say about this
              product.
            </p>

          </div>


          {/* ================================================= */}
          {/* RATING SUMMARY */}
          {/* ================================================= */}

          <div className="rating-summary-card">

            <div className="rating-average">

              <div className="average-rating-number">
                {Number(
                  product.averageRating || 0
                ).toFixed(1)}
              </div>

              <div className="average-stars">
                ★★★★★
              </div>

              <div className="average-review-count">

                {product.reviewCount || 0}{" "}

                {Number(product.reviewCount || 0) === 1
                  ? "review"
                  : "reviews"}

              </div>

            </div>


            <div className="rating-distribution">

              {[5, 4, 3, 2, 1].map((rating) => (

                <div
                  className="rating-distribution-row"
                  key={rating}
                >

                  <span className="rating-number">
                    {rating}
                  </span>

                  <span className="small-star">
                    ★
                  </span>

                  <div className="rating-progress">

                    <div
                      className="rating-progress-fill"
                      style={{
                        width: `${getRatingPercentage(
                          rating
                        )}%`,
                      }}
                    ></div>

                  </div>

                  <span className="rating-count">
                    {getRatingCount(rating)}
                  </span>

                </div>

              ))}

            </div>

          </div>


          {/* ================================================= */}
          {/* SUCCESS / ERROR MESSAGE */}
          {/* ================================================= */}

          {reviewMessage && (
            <div className="review-success-message">
              {reviewMessage}
            </div>
          )}

          {reviewError && (
            <div className="review-error-message">
              {reviewError}
            </div>
          )}


          {/* ================================================= */}
          {/* WRITE REVIEW */}
          {/* ================================================= */}

          {localStorage.getItem("token") && (

            <div className="write-review-card">

              <div className="write-review-heading">

                <h3>Write a Review</h3>

                <p>
                  Share your experience with this
                  product.
                </p>

              </div>


              <form onSubmit={handleSubmitReview}>

                <div className="review-rating-input">

                  <label>Your Rating</label>

                  <div className="interactive-stars">

                    {[1, 2, 3, 4, 5].map(
                      (rating) => (

                        <button
                          key={rating}
                          type="button"
                          className={
                            rating <= selectedRating
                              ? "rating-star selected"
                              : "rating-star"
                          }
                          onClick={() =>
                            setSelectedRating(rating)
                          }
                          aria-label={`Rate ${rating} out of 5`}
                        >
                          ★
                        </button>

                      )
                    )}

                  </div>

                </div>


                <div className="review-comment-input">

                  <label htmlFor="reviewComment">
                    Your Review
                  </label>

                  <textarea
                    id="reviewComment"
                    rows="5"
                    placeholder="Write your experience with this product..."
                    value={reviewComment}
                    onChange={(event) =>
                      setReviewComment(
                        event.target.value
                      )
                    }
                  ></textarea>

                </div>


                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </form>

            </div>

          )}


          {!localStorage.getItem("token") && (

            <div className="login-review-message">

              <h4>
                Want to share your experience?
              </h4>

              <p>
                Please login to write a review for
                this product.
              </p>

            </div>

          )}


          {/* ================================================= */}
          {/* REVIEW LIST */}
          {/* ================================================= */}

          <div className="reviews-list-section">

            <div className="reviews-list-heading">

              <h3>
                Customer Reviews

                <span>
                  {product.reviewCount || 0}
                </span>
              </h3>

            </div>


            {reviewsLoading ? (

              <div className="reviews-loading">
                Loading reviews...
              </div>

            ) : reviews.length === 0 ? (

              <div className="no-reviews">

                <div className="no-reviews-icon">
                  ★
                </div>

                <h4>No reviews yet</h4>

                <p>
                  Be the first customer to review
                  this product.
                </p>

              </div>

            ) : (

              <div className="reviews-list">

                {reviews.map((review) => {

                  const isOwnReview =
                    currentUser &&
                    Number(currentUser.id) ===
                      Number(review.userId);

                  const isEditing =
                    editingReviewId ===
                    review.reviewId;

                  return (

                    <div
                      className="review-card"
                      key={review.reviewId}
                    >

                      {/* ======================================= */}
                      {/* REVIEW HEADER */}
                      {/* ======================================= */}

                      <div className="review-card-top">

                        <div className="review-user">

                          <div className="review-avatar">
                            {review.userName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <h4>
                              {review.userName}
                            </h4>

                            <span>
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </span>

                          </div>

                        </div>


                        {!isEditing && (

                          <div className="review-right-section">

                            <div className="review-stars">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (

                                  <span
                                    key={star}
                                    className={
                                      star <=
                                      review.rating
                                        ? "filled"
                                        : ""
                                    }
                                  >
                                    ★
                                  </span>

                                )
                              )}

                            </div>


                            {/* ================================= */}
                            {/* OWN REVIEW ACTIONS */}
                            {/* ================================= */}

                            {isOwnReview && (

                              <div className="review-actions">

                                <button
                                  type="button"
                                  className="review-edit-button"
                                  onClick={() =>
                                    handleStartEdit(
                                      review
                                    )
                                  }
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  className="review-delete-button"
                                  onClick={() =>
                                    handleDeleteReview(
                                      review.reviewId
                                    )
                                  }
                                  disabled={
                                    deletingReviewId ===
                                    review.reviewId
                                  }
                                >
                                  {deletingReviewId ===
                                  review.reviewId
                                    ? "Deleting..."
                                    : "🗑️ Delete"}
                                </button>

                              </div>

                            )}

                          </div>

                        )}

                      </div>


                      {/* ======================================= */}
                      {/* EDIT FORM */}
                      {/* ======================================= */}

                      {isEditing ? (

                        <div className="review-edit-form">

                          <div className="review-edit-rating">

                            <label>
                              Your Rating
                            </label>

                            <div className="interactive-stars">

                              {[1, 2, 3, 4, 5].map(
                                (rating) => (

                                  <button
                                    key={rating}
                                    type="button"
                                    className={
                                      rating <=
                                      editingRating
                                        ? "rating-star selected"
                                        : "rating-star"
                                    }
                                    onClick={() =>
                                      setEditingRating(
                                        rating
                                      )
                                    }
                                  >
                                    ★
                                  </button>

                                )
                              )}

                            </div>

                          </div>


                          <div className="review-edit-comment">

                            <label
                              htmlFor={`edit-review-${review.reviewId}`}
                            >
                              Your Review
                            </label>

                            <textarea
                              id={`edit-review-${review.reviewId}`}
                              rows="4"
                              value={editingComment}
                              onChange={(event) =>
                                setEditingComment(
                                  event.target.value
                                )
                              }
                            ></textarea>

                          </div>


                          <div className="review-edit-actions">

                            <button
                              type="button"
                              className="review-cancel-button"
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                editingReviewLoading
                              }
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              className="review-save-button"
                              onClick={() =>
                                handleUpdateReview(
                                  review.reviewId
                                )
                              }
                              disabled={
                                editingReviewLoading
                              }
                            >
                              {editingReviewLoading
                                ? "Saving..."
                                : "Save Changes"}
                            </button>

                          </div>

                        </div>

                      ) : (

                        <p className="review-comment">
                          {review.comment}
                        </p>

                      )}

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;