import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/orders");

      setOrders(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      <main className="orders-page">
        <section className="orders-hero">
          <div className="container">
            <span className="section-badge">MY ACCOUNT</span>

            <h1>My Orders</h1>

            <p>
              Track and manage all your recent purchases in one place.
            </p>
          </div>
        </section>

        <section className="orders-section">
          <div className="container">
            <div className="orders-loading">
              <div className="spinner-border text-primary" />
              <p>Loading your orders...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <section className="orders-hero">
          <div className="container">
            <span className="section-badge">MY ACCOUNT</span>

            <h1>My Orders</h1>

            <p>
              Track and manage all your recent purchases in one place.
            </p>
          </div>
        </section>

        <section className="orders-section">
          <div className="container">
            <div className="orders-empty-card">
              <div className="empty-icon">⚠️</div>

              <h3>Unable to load orders</h3>

              <p>{error}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchOrders}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <section className="orders-hero">
          <div className="container">
            <span className="section-badge">MY ACCOUNT</span>

            <h1>My Orders</h1>

            <p>
              Track and manage all your recent purchases in one place.
            </p>
          </div>
        </section>

        <section className="orders-section">
          <div className="container">
            <div className="orders-empty-card">
              <div className="empty-icon">📦</div>

              <h3>No orders yet</h3>

              <p>
                You haven't placed any orders yet. Start exploring
                our products and find something you love.
              </p>

              <Link
                to="/shop"
                className="btn btn-primary"
              >
                Start Shopping →
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">

      {/* HERO */}
      <section className="orders-hero">
        <div className="container">

          <span className="section-badge">
            MY ACCOUNT
          </span>

          <div className="orders-heading-row">
            <div>
              <h1>My Orders</h1>

              <p>
                Track and manage all your recent purchases in one place.
              </p>
            </div>

            <div className="orders-count">
              <strong>{orders.length}</strong>
              <span>
                {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* ORDERS */}
      <section className="orders-section">
        <div className="container">

          <div className="orders-list">

            {orders.map((order) => (

              <article
                className="modern-order-card"
                key={order.orderId}
              >

                {/* ORDER HEADER */}
                <div className="order-card-header">

                  <div className="order-id-area">

                    <div className="order-icon">
                      📦
                    </div>

                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <h3>
                        #{order.orderId}
                      </h3>
                    </div>

                  </div>


                  <div className="order-date-area">
                    <span>Ordered on</span>

                    <strong>
                      {formatDate(order.orderDate)}
                    </strong>
                  </div>

                </div>


                {/* DIVIDER */}
                <div className="order-divider" />


                {/* ORDER BODY */}
                <div className="order-card-body">

                  <div className="order-products">

                    {order.items
                      ?.slice(0, 3)
                      .map((item) => (

                        <div
                          className="order-product-preview"
                          key={item.orderItemId}
                        >

                          <div className="order-product-image">
                            🛍️
                          </div>

                          <div className="order-product-info">

                            <h4>
                              {item.productName}
                            </h4>

                            <span>
                              Qty: {item.quantity}
                            </span>

                          </div>

                        </div>

                      ))}


                    {order.items &&
                      order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3} more
                        </div>
                      )}

                  </div>


                  <div className="order-right-info">

                    <div>
                      <span className="order-info-label">
                        STATUS
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


                    <div className="order-total-block">

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* FOOTER */}
                <div className="order-card-footer">

                  <span className="items-count">
                    {order.items?.length || 0}{" "}
                    {order.items?.length === 1
                      ? "item"
                      : "items"}
                  </span>


                  <Link
                    to={`/orders/${order.orderId}`}
                    className="order-view-button"
                  >
                    View Order
                    <span>→</span>
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </div>
      </section>

    </main>
  );
}

export default Orders;