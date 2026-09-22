import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Load addresses and cart
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        setError("");

        const [addressResponse, cartResponse] =
          await Promise.all([
            api.get("/api/addresses"),
            api.get("/api/cart"),
          ]);

        const loadedAddresses = addressResponse.data;
        const loadedCart = cartResponse.data;

        setAddresses(loadedAddresses);
        setCart(loadedCart);

        // Select default address automatically
        const defaultAddress = loadedAddresses.find(
          (address) => address.isDefault
        );

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (loadedAddresses.length > 0) {
          setSelectedAddress(loadedAddresses[0].id);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load checkout information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  // Handle address form changes
  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new address
  const handleAddAddress = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const response = await api.post(
        "/api/addresses",
        addressForm
      );

      const newAddress = response.data;

      setAddresses((previous) => [
        ...previous,
        newAddress,
      ]);

      setSelectedAddress(newAddress.id);

      setAddressForm({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });

      setShowAddressForm(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add address."
      );
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/api/orders", {
        addressId: selectedAddress,
      });

      const order = response.data;

      alert(
        `Order placed successfully! Order #${order.orderId}`
      );

      navigate("/orders");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="checkout-page">
        <div className="container py-5 text-center">
          <p>Loading checkout...</p>
        </div>
      </main>
    );
  }

  // Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container py-5 text-center">

          <div
            style={{
              fontSize: "4rem",
              marginBottom: "20px",
            }}
          >
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p className="text-muted">
            Add some products before checking out.
          </p>

          <Link
            to="/shop"
            className="btn btn-primary"
          >
            Continue Shopping →
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      {/* Header */}
      <section className="cart-header">

        <div className="container text-center">

          <span className="section-badge">
            CHECKOUT
          </span>

          <h1 className="cart-title">
            Complete Your Order
          </h1>

          <p className="cart-description">
            Select your delivery address and place your order.
          </p>

        </div>

      </section>


      <section className="py-5">

        <div className="container">

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="row g-4">

            {/* Left Side */}
            <div className="col-lg-8">

              {/* Address Section */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>
                    <h4 className="mb-1">
                      Delivery Address
                    </h4>

                    <p className="text-muted mb-0">
                      Choose where your order should be delivered.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                      setShowAddressForm(!showAddressForm)
                    }
                  >
                    {showAddressForm
                      ? "Cancel"
                      : "+ Add Address"}
                  </button>

                </div>


                {/* Address List */}
                {addresses.length > 0 && (
                  <div className="row g-3">

                    {addresses.map((address) => (

                      <div
                        className="col-md-6"
                        key={address.id}
                      >

                        <div
                          className={`border rounded-4 p-3 h-100 ${
                            selectedAddress === address.id
                              ? "border-primary bg-light"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setSelectedAddress(address.id)
                          }
                        >

                          <div className="d-flex align-items-start gap-2">

                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={
                                selectedAddress ===
                                address.id
                              }
                              onChange={() =>
                                setSelectedAddress(
                                  address.id
                                )
                              }
                              className="mt-1"
                            />

                            <div>

                              <h6 className="mb-1">
                                {address.fullName}
                              </h6>

                              {address.isDefault && (
                                <span className="badge bg-primary mb-2">
                                  Default
                                </span>
                              )}

                              <p className="mb-1">
                                {address.addressLine}
                              </p>

                              <p className="mb-1">
                                {address.city},{" "}
                                {address.state}
                              </p>

                              <p className="mb-1">
                                Pincode:{" "}
                                {address.pincode}
                              </p>

                              <p className="mb-0">
                                Phone:{" "}
                                {address.phone}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                )}


                {/* No Address */}
                {addresses.length === 0 &&
                  !showAddressForm && (
                    <div className="text-center py-4">

                      <p className="text-muted">
                        You don't have any saved addresses.
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          setShowAddressForm(true)
                        }
                      >
                        Add Delivery Address
                      </button>

                    </div>
                  )}


                {/* Add Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleAddAddress}
                    className="mt-4 border-top pt-4"
                  >

                    <h5 className="mb-4">
                      Add New Address
                    </h5>

                    <div className="row g-3">

                      <div className="col-md-6">

                        <label className="form-label">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="fullName"
                          className="form-control"
                          value={addressForm.fullName}
                          onChange={handleAddressChange}
                          required
                        />

                      </div>


                      <div className="col-md-6">

                        <label className="form-label">
                          Phone
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          maxLength="10"
                          required
                        />

                      </div>


                      <div className="col-12">

                        <label className="form-label">
                          Address
                        </label>

                        <textarea
                          name="addressLine"
                          className="form-control"
                          rows="3"
                          value={addressForm.addressLine}
                          onChange={handleAddressChange}
                          required
                        />

                      </div>


                      <div className="col-md-4">

                        <label className="form-label">
                          City
                        </label>

                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          required
                        />

                      </div>


                      <div className="col-md-4">

                        <label className="form-label">
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          required
                        />

                      </div>


                      <div className="col-md-4">

                        <label className="form-label">
                          Pincode
                        </label>

                        <input
                          type="text"
                          name="pincode"
                          className="form-control"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          maxLength="6"
                          required
                        />

                      </div>


                      <div className="col-12">

                        <div className="form-check">

                          <input
                            type="checkbox"
                            name="isDefault"
                            className="form-check-input"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                            id="defaultAddress"
                          />

                          <label
                            className="form-check-label"
                            htmlFor="defaultAddress"
                          >
                            Make this my default address
                          </label>

                        </div>

                      </div>


                      <div className="col-12">

                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Save Address
                        </button>

                      </div>

                    </div>

                  </form>
                )}

              </div>


              {/* Order Items */}
              <div className="card border-0 shadow-sm rounded-4 p-4">

                <h4 className="mb-4">
                  Order Items
                </h4>

                {cart.items.map((item) => (

                  <div
                    key={item.cartItemId}
                    className="d-flex align-items-center justify-content-between border-bottom py-3"
                  >

                    <div className="d-flex align-items-center gap-3">

                      <div
                        className="rounded-3 bg-light d-flex align-items-center justify-content-center"
                        style={{
                          width: "60px",
                          height: "60px",
                          fontSize: "1.5rem",
                        }}
                      >
                        🛍️
                      </div>

                      <div>

                        <h6 className="mb-1">
                          {item.productName}
                        </h6>

                        <small className="text-muted">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString("en-IN")}{" "}
                          × {item.quantity}
                        </small>

                      </div>

                    </div>

                    <strong>
                      ₹
                      {Number(
                        item.subtotal
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                ))}

              </div>

            </div>


            {/* Right Side */}
            <div className="col-lg-4">

              <div className="cart-summary sticky-top"
                style={{ top: "100px" }}
              >

                <h4>
                  Order Summary
                </h4>

                <div className="summary-row">
                  <span>
                    Items
                  </span>

                  <strong>
                    {cart.items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {Number(
                      cart.total || 0
                    ).toLocaleString("en-IN")}
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
                    {Number(
                      cart.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  disabled={
                    !selectedAddress ||
                    placingOrder
                  }
                  onClick={handlePlaceOrder}
                >
                  {placingOrder
                    ? "Placing Order..."
                    : "Place Order →"}
                </button>

                {!selectedAddress && (
                  <small className="text-danger d-block mt-2">
                    Please select a delivery address.
                  </small>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Checkout;