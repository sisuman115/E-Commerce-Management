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

  const handleAddToCart = async () => {
    try {
      await api.post("/api/cart/items", {
        productId: product.id,
        quantity: quantity,
      });

      alert("Product added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart.");
    }
  };

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
      alert(error.response?.data?.message || "Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="container py-5 text-center">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="container py-5 text-center">
          <p className="text-danger">{error || "Product not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
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
                  <div className="product-details-placeholder">🛍️</div>
                )}
              </div>
            </div>

            {/* PRODUCT INFORMATION */}

            <div className="col-lg-6">
              <span className="product-category">
                {product.categoryName || "Uncategorized"}
              </span>

              <h1 className="product-details-title">{product.name}</h1>

              <div className="product-details-rating">
                ⭐⭐⭐⭐⭐
                <span>
                  {product.averageRating || 0} ({product.reviewCount || 0}{" "}
                  Reviews)
                </span>
              </div>

              <h2 className="product-details-price">
                ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
              </h2>

              <p className="product-details-description">
                {product.description}
              </p>

              <div className="product-stock">
                <span className="stock-dot"></span>

                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </div>

              <hr />

              {/* QUANTITY */}

              <div className="quantity-section">
                <label>Quantity</label>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="product-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  🛒 Add to Cart
                </button>

                {/* WISHLIST */}

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
                  {wishlistLoading ? "..." : product.isWishlisted ? "♥" : "♡"}
                </button>
              </div>

              {/* BUY NOW */}

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
    </main>
  );
}

export default ProductDetails;
