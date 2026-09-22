import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingProduct, setRemovingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/wishlist");

      setWishlist(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load your wishlist.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingProduct(productId);

      await api.delete(`/api/wishlist/items/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove product from wishlist.",
      );
    } finally {
      setRemovingProduct(null);
    }
  };

  const addToCart = async (productId) => {
    try {
      setAddingProduct(productId);

      await api.post("/api/cart/items", {
        productId,
        quantity: 1,
      });

      alert("Product added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart.");
    } finally {
      setAddingProduct(null);
    }
  };

  if (loading) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-hero">
          <div className="container">
            <span className="section-badge">SAVED PRODUCTS</span>

            <h1>My Wishlist</h1>

            <p>Save products you love and come back to them anytime.</p>
          </div>
        </section>

        <section className="wishlist-section">
          <div className="container">
            <div className="wishlist-loading">
              <div className="spinner-border text-primary" />

              <p>Loading your wishlist...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-hero">
          <div className="container">
            <span className="section-badge">SAVED PRODUCTS</span>

            <h1>My Wishlist</h1>

            <p>Save products you love and come back to them anytime.</p>
          </div>
        </section>

        <section className="wishlist-section">
          <div className="container">
            <div className="wishlist-empty-card">
              <div className="wishlist-empty-icon">⚠️</div>

              <h3>Unable to load wishlist</h3>

              <p>{error}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchWishlist}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-hero">
          <div className="container">
            <span className="section-badge">SAVED PRODUCTS</span>

            <h1>My Wishlist</h1>

            <p>Save products you love and come back to them anytime.</p>
          </div>
        </section>

        <section className="wishlist-section">
          <div className="container">
            <div className="wishlist-empty-card">
              <div className="wishlist-empty-icon">♡</div>

              <h3>Your wishlist is empty</h3>

              <p>
                You haven't saved any products yet. Explore our collection and
                save the ones you love.
              </p>

              <Link to="/shop" className="btn btn-primary">
                Explore Products →
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="wishlist-hero">
        <div className="container">
          <span className="section-badge">SAVED PRODUCTS</span>

          <div className="wishlist-heading-row">
            <div>
              <h1>My Wishlist</h1>

              <p>Save products you love and come back to them anytime.</p>
            </div>

            <div className="wishlist-count">
              <strong>{wishlist.length}</strong>

              <span>
                {wishlist.length === 1 ? "Saved Item" : "Saved Items"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRODUCTS */}
      {/* ================================================= */}

      <section className="wishlist-section">
        <div className="container">
          <div className="row g-4">
            {wishlist.map((item) => (
              <div className="col-sm-6 col-lg-4" key={item.productId}>
                <article className="wishlist-card">
                  {/* IMAGE */}

                  <div className="wishlist-image">
                    <span className="wishlist-image-icon">🛍️</span>

                    <button
                      type="button"
                      className="wishlist-remove"
                      disabled={removingProduct === item.productId}
                      onClick={() => removeFromWishlist(item.productId)}
                      aria-label="Remove from wishlist"
                    >
                      {removingProduct === item.productId ? "..." : "♥"}
                    </button>
                  </div>

                  {/* CONTENT */}

                  <div className="wishlist-card-content">
                    <span className="wishlist-category">
                      {item.categoryName || "Product"}
                    </span>

                    <Link
                      to={`/product/${item.productId}`}
                      className="wishlist-product-name"
                    >
                      {item.productName}
                    </Link>

                    <div className="wishlist-rating">
                      <span className="wishlist-stock">
                        {item.stock > 0 ? "✓ In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="wishlist-card-footer">
                      <strong className="wishlist-price">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </strong>

                      <button
                        type="button"
                        className="wishlist-cart-button"
                        disabled={addingProduct === item.productId}
                        onClick={() => addToCart(item.productId)}
                      >
                        {addingProduct === item.productId
                          ? "Adding..."
                          : "🛒 Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* CONTINUE SHOPPING */}

          <div className="wishlist-bottom">
            <Link to="/shop" className="wishlist-continue-link">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Wishlist;
