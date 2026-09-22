import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

  // Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/cart");

      setCart(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load cart when page opens
  useEffect(() => {
    fetchCart();
  }, []);

  // Increase quantity
  const increaseQuantity = async (item) => {
    try {
      setUpdatingItem(item.cartItemId);

      const newQuantity = item.quantity + 1;

      const response = await api.put(
        `/api/cart/items/${item.cartItemId}?quantity=${newQuantity}`
      );

      setCart(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      setUpdatingItem(item.cartItemId);

      const newQuantity = item.quantity - 1;

      const response = await api.put(
        `/api/cart/items/${item.cartItemId}?quantity=${newQuantity}`
      );

      setCart(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove cart item
  const removeItem = async (cartItemId) => {
    try {
      setUpdatingItem(cartItemId);

      const response = await api.delete(
        `/api/cart/items/${cartItemId}`
      );

      setCart(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="cart-page">
        <section className="cart-header">
          <div className="container text-center">
            <span className="section-badge">YOUR CART</span>

            <h1 className="cart-title">
              Shopping Cart
            </h1>

            <p className="cart-description">
              Review your selected products before checkout.
            </p>
          </div>
        </section>

        <section className="cart-section py-5">
          <div className="container text-center">
            <p>Loading cart...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="cart-page">
        <section className="cart-header">
          <div className="container text-center">
            <span className="section-badge">YOUR CART</span>

            <h1 className="cart-title">
              Shopping Cart
            </h1>
          </div>
        </section>

        <section className="cart-section py-5">
          <div className="container text-center">
            <p className="text-danger">
              {error}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchCart}
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  const cartItems = cart?.items || [];

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <section className="cart-header">
          <div className="container text-center">

            <span className="section-badge">
              YOUR CART
            </span>

            <h1 className="cart-title">
              Shopping Cart
            </h1>

            <p className="cart-description">
              Review your selected products before checkout.
            </p>

          </div>
        </section>

        <section className="cart-section py-5">

          <div className="container">

            <div className="text-center py-5">

              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "20px"
                }}
              >
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet.
              </p>

              <Link
                to="/shop"
                className="btn btn-primary"
              >
                Continue Shopping →
              </Link>

            </div>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="cart-page">

      {/* Cart Header */}
      <section className="cart-header">

        <div className="container text-center">

          <span className="section-badge">
            YOUR CART
          </span>

          <h1 className="cart-title">
            Shopping Cart
          </h1>

          <p className="cart-description">
            Review your selected products before checkout.
          </p>

        </div>

      </section>


      {/* Cart Section */}
      <section className="cart-section py-5">

        <div className="container">

          <div className="row g-4">

            {/* Cart Items */}
            <div className="col-lg-8">

              <div className="cart-items">

                {cartItems.map((item) => (

                  <div
                    className="cart-item"
                    key={item.cartItemId}
                  >

                    {/* Product Image */}
                    <div className="cart-item-image">
                      🛍️
                    </div>


                    {/* Product Details */}
                    <div className="cart-item-details">

                      <span>
                        Product
                      </span>

                      <h5>
                        {item.productName}
                      </h5>

                      <p>
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                      </p>


                      {/* Quantity */}
                      <div className="cart-quantity">

                        <button
                          type="button"
                          disabled={
                            updatingItem === item.cartItemId ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            decreaseQuantity(item)
                          }
                        >
                          −
                        </button>

                        <span>
                          {updatingItem === item.cartItemId
                            ? "..."
                            : item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            updatingItem === item.cartItemId
                          }
                          onClick={() =>
                            increaseQuantity(item)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* Item Total */}
                    <div className="cart-item-total">

                      <strong>
                        ₹
                        {Number(item.subtotal).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        type="button"
                        className="remove-cart-item"
                        disabled={
                          updatingItem === item.cartItemId
                        }
                        onClick={() =>
                          removeItem(item.cartItemId)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>


              {/* Continue Shopping */}
              <div className="mt-4">

                <Link
                  to="/shop"
                  className="text-decoration-none"
                >
                  ← Continue Shopping
                </Link>

              </div>

            </div>


            {/* Cart Summary */}
            <div className="col-lg-4">

              <div className="cart-summary">

                <h4>
                  Order Summary
                </h4>


                <div className="summary-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {Number(cart.total || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                <div className="summary-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    Free
                  </strong>

                </div>


                <hr />


                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(cart.total || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                <Link
                  to="/checkout"
                  className="btn btn-primary w-100"
                >
                  Proceed to Checkout →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Cart;