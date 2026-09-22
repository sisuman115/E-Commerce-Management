import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/orders/${id}`);

      setOrder(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "order-status placed";

      case "CONFIRMED":
        return "order-status confirmed";

      case "SHIPPED":
        return "order-status shipped";

      case "DELIVERED":
        return "order-status delivered";

      case "CANCELLED":
        return "order-status cancelled";

      default:
        return "order-status";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="container">
          <div className="orders-loading">
            <div className="spinner-border text-primary" />
            <p>Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-page">
        <div className="container">

          <div className="orders-empty-card">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>Order not found</h3>

            <p>
              {error || "We couldn't find this order."}
            </p>

            <Link
              to="/orders"
              className="btn btn-primary"
            >
              ← Back to Orders
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">

      {/* HEADER */}
      <section className="order-details-hero">

        <div className="container">

          <Link
            to="/orders"
            className="back-orders-link"
          >
            ← Back to Orders
          </Link>

          <div className="order-details-heading">

            <div>
              <span className="section-badge">
                ORDER DETAILS
              </span>

              <h1>
                Order #{order.orderId}
              </h1>

              <p>
                Placed on {formatDate(order.orderDate)}
              </p>
            </div>

            <span
              className={getStatusClass(order.status)}
            >
              <span className="status-dot" />

              {order.status}
            </span>

          </div>

        </div>

      </section>


      {/* CONTENT */}
      <section className="order-details-section">

        <div className="container">

          <div className="row g-4">

            {/* LEFT */}
            <div className="col-lg-8">

              {/* ITEMS */}
              <div className="details-card">

                <div className="details-card-header">

                  <div>
                    <span className="card-eyebrow">
                      YOUR PURCHASE
                    </span>

                    <h2>Order Items</h2>
                  </div>

                  <span className="item-count-badge">
                    {order.items?.length || 0} items
                  </span>

                </div>


                <div className="details-items">

                  {order.items?.map((item) => (

                    <div
                      className="details-item"
                      key={item.orderItemId}
                    >

                      <div className="details-product-image">
                        🛍️
                      </div>

                      <div className="details-product-info">

                        <h3>
                          {item.productName}
                        </h3>

                        <p>
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString("en-IN")}
                          {" "}×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <strong className="details-item-total">
                        ₹
                        {Number(
                          item.subtotal
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  ))}

                </div>

              </div>


              {/* ADDRESS */}
              <div className="details-card">

                <div className="details-card-header">

                  <div>
                    <span className="card-eyebrow">
                      DELIVERY
                    </span>

                    <h2>Shipping Address</h2>
                  </div>

                  <div className="address-icon">
                    📍
                  </div>

                </div>


                <div className="shipping-address">

                  <strong>
                    {order.shippingFullName}
                  </strong>

                  <p>
                    {order.shippingAddressLine}
                  </p>

                  <p>
                    {order.shippingCity},{" "}
                    {order.shippingState}{" "}
                    - {order.shippingPincode}
                  </p>

                  <span>
                    📞 {order.shippingPhone}
                  </span>

                </div>

              </div>

            </div>


            {/* RIGHT */}
            <div className="col-lg-4">

              <div className="order-summary-card">

                <span className="card-eyebrow">
                  ORDER SUMMARY
                </span>

                <h2>Payment Summary</h2>


                <div className="summary-detail-row">
                  <span>Items</span>

                  <strong>
                    {order.items?.length || 0}
                  </strong>
                </div>


                <div className="summary-detail-row">
                  <span>Shipping</span>

                  <strong className="free-text">
                    Free
                  </strong>
                </div>


                <div className="summary-line" />


                <div className="summary-final-row">

                  <span>Total</span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>


                <div className="order-summary-status">

                  <span>
                    Current Status
                  </span>

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    <span className="status-dot" />

                    {order.status}
                  </span>

                </div>

              </div>


              <Link
                to="/shop"
                className="continue-shopping-button"
              >
                Continue Shopping
                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default OrderDetails;