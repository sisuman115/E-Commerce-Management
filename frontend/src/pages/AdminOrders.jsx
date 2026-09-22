import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ==========================================
  // FETCH ALL ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/orders/all");

      setOrders(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // GET AVAILABLE NEXT STATUSES
  // ==========================================

  const getAvailableStatuses = (status) => {
    switch (status) {
      case "PLACED":
        return ["CONFIRMED", "CANCELLED"];

      case "CONFIRMED":
        return ["SHIPPED", "CANCELLED"];

      case "SHIPPED":
        return ["DELIVERED", "CANCELLED"];

      case "DELIVERED":
        return [];

      case "CANCELLED":
        return [];

      default:
        return [];
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (order, newStatus) => {
    if (!newStatus) {
      return;
    }

    const confirmed = window.confirm(
      `Change Order #${order.orderId} status from ${order.status} to ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingOrderId(order.orderId);

      const response = await api.put(
        `/api/orders/${order.orderId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.orderId === order.orderId
            ? response.data
            : item
        )
      );

      alert("Order status updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // GET STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "placed";

      case "CONFIRMED":
        return "confirmed";

      case "SHIPPED":
        return "shipped";

      case "DELIVERED":
        return "delivered";

      case "CANCELLED":
        return "cancelled";

      default:
        return "";
    }
  };

  // ==========================================
  // GET ITEM SUMMARY
  // ==========================================

  const getItemSummary = (items) => {
    if (!items || items.length === 0) {
      return "No items";
    }

    if (items.length === 1) {
      return `${items[0].productName} × ${items[0].quantity}`;
    }

    return `${items[0].productName} × ${items[0].quantity} + ${
      items.length - 1
    } more`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="admin-orders-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="admin-orders-header">

        <div className="container">

          <div className="admin-orders-heading-row">

            <div>

              <span className="section-badge">
                ADMIN PANEL
              </span>

              <h1 className="admin-orders-title">
                Order Management
              </h1>

              <p className="admin-orders-description">
                View customer orders and manage their status.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          CONTENT
      ====================================== */}

      <section className="admin-orders-content">

        <div className="container">

          {/* LOADING */}

          {loading && (
            <div className="admin-orders-loading">

              <div className="spinner-border text-primary"></div>

              <p>Loading orders...</p>

            </div>
          )}

          {/* ERROR */}

          {error && !loading && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="admin-orders-empty">

                <div className="admin-order-empty-icon">
                  📦
                </div>

                <h3>No Orders Found</h3>

                <p>
                  There are currently no customer orders.
                </p>

              </div>
            )}

          {/* ORDERS */}

          {!loading &&
            !error &&
            orders.length > 0 && (

              <div className="admin-orders-list">

                {orders.map((order) => {

                  const availableStatuses =
                    getAvailableStatuses(order.status);

                  const isUpdating =
                    updatingOrderId === order.orderId;

                  return (
                    <div
                      className="admin-order-card"
                      key={order.orderId}
                    >

                      {/* =================================
                          ORDER HEADER
                      ================================= */}

                      <div className="admin-order-card-header">

                        <div>

                          <div className="admin-order-number">
                            Order #{order.orderId}
                          </div>

                          <div className="admin-order-date">
                            {formatDate(order.orderDate)}
                          </div>

                        </div>

                        <span
                          className={`admin-order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </div>

                      {/* =================================
                          ORDER BODY
                      ================================= */}

                      <div className="admin-order-card-body">

                        {/* CUSTOMER */}

                        <div className="admin-order-section">

                          <h4>Customer</h4>

                          <div className="admin-order-customer">

                            <div className="admin-order-avatar">
                              {order.shippingFullName
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </div>

                            <div>

                              <strong>
                                {order.shippingFullName || "-"}
                              </strong>

                              <span>
                                {order.shippingPhone || "-"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* SHIPPING */}

                        <div className="admin-order-section">

                          <h4>Shipping Address</h4>

                          <p className="admin-order-address">
                            {order.shippingAddressLine || "-"}
                            <br />
                            {order.shippingCity || "-"},{" "}
                            {order.shippingState || "-"}
                            <br />
                            PIN: {order.shippingPincode || "-"}
                          </p>

                        </div>

                        {/* ITEMS */}

                        <div className="admin-order-section">

                          <h4>Items</h4>

                          <p className="admin-order-items-summary">
                            {getItemSummary(order.items)}
                          </p>

                          {order.items?.length > 1 && (
                            <div className="admin-order-item-count">
                              {order.items.length} items
                            </div>
                          )}

                        </div>

                        {/* TOTAL */}

                        <div className="admin-order-section admin-order-total-section">

                          <h4>Total</h4>

                          <strong className="admin-order-total">
                            {formatCurrency(order.totalAmount)}
                          </strong>

                        </div>

                      </div>

                      {/* =================================
                          ITEMS DETAIL
                      ================================= */}

                      {order.items?.length > 0 && (

                        <div className="admin-order-items">

                          <h4>Order Items</h4>

                          <div className="admin-order-items-list">

                            {order.items.map((item) => (

                              <div
                                className="admin-order-item"
                                key={item.orderItemId}
                              >

                                <div className="admin-order-item-image">

                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.productName}
                                    />
                                  ) : (
                                    <span>🛍️</span>
                                  )}

                                </div>

                                <div className="admin-order-item-info">

                                  <strong>
                                    {item.productName}
                                  </strong>

                                  <span>
                                    Qty: {item.quantity}
                                  </span>

                                </div>

                                <div className="admin-order-item-price">

                                  <span>
                                    {formatCurrency(item.price)}
                                  </span>

                                  <strong>
                                    {formatCurrency(item.subtotal)}
                                  </strong>

                                </div>

                              </div>

                            ))}

                          </div>

                        </div>

                      )}

                      {/* =================================
                          ACTIONS
                      ================================= */}

                      <div className="admin-order-card-footer">

                        <div className="admin-order-status-control">

                          <label>
                            Update Status
                          </label>

                          <select
                            className="admin-order-status-select"
                            value=""
                            disabled={
                              isUpdating ||
                              availableStatuses.length === 0
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                order,
                                event.target.value
                              )
                            }
                          >

                            <option value="">
                              {isUpdating
                                ? "Updating..."
                                : availableStatuses.length === 0
                                ? "No changes available"
                                : "Select new status"}
                            </option>

                            {availableStatuses.map((status) => (

                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>

                            ))}

                          </select>

                        </div>

                        {order.status === "DELIVERED" && (
                          <span className="admin-order-final-message">
                            ✓ Order completed
                          </span>
                        )}

                        {order.status === "CANCELLED" && (
                          <span className="admin-order-final-message cancelled-message">
                            Order cancelled
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          {/* BACK TO DASHBOARD */}

          <div className="admin-orders-bottom">

            <Link
              to="/admin"
              className="admin-back-link"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminOrders;