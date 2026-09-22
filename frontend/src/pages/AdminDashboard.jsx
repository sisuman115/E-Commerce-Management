import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [orderStats, setOrderStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          dashboardResponse,
          revenueResponse,
          orderStatsResponse,
        ] = await Promise.all([
          api.get("/api/admin/dashboard"),
          api.get("/api/admin/dashboard/monthly-revenue"),
          api.get("/api/admin/dashboard/order-status"),
        ]);

        setDashboard(dashboardResponse.data);
        setMonthlyRevenue(revenueResponse.data);
        setOrderStats(orderStatsResponse.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getOrderCount = (status) => {
    const item = orderStats.find(
      (order) => order.status === status
    );

    return item ? item.count : 0;
  };

  const formatMonth = (year, month) => {
    const date = new Date(year, month - 1);

    return date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary"></div>

          <p className="mt-3 mb-0">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard-page">
        <div className="container py-5">
          <div className="alert alert-danger">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">

      {/* HEADER */}

      <section className="admin-dashboard-header">
        <div className="container">

          <span className="section-badge">
            ADMIN PANEL
          </span>

          <h1 className="admin-dashboard-title">
            Dashboard
          </h1>

          <p className="admin-dashboard-description">
            Manage your ShopEase store and monitor
            your business activity.
          </p>

        </div>
      </section>


      {/* DASHBOARD CONTENT */}

      <section className="admin-dashboard-content">
        <div className="container">


          {/* MAIN STATISTICS */}

          <div className="row g-4">

            {/* PRODUCTS */}

            <div className="col-md-6 col-xl-3">
              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  📦
                </div>

                <div>
                  <p>Total Products</p>

                  <h2>
                    {dashboard?.totalProducts ?? 0}
                  </h2>
                </div>

              </div>
            </div>


            {/* CUSTOMERS */}

            <div className="col-md-6 col-xl-3">
              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  👥
                </div>

                <div>
                  <p>Total Customers</p>

                  <h2>
                    {dashboard?.totalUsers ?? 0}
                  </h2>
                </div>

              </div>
            </div>


            {/* ORDERS */}

            <div className="col-md-6 col-xl-3">
              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  🛒
                </div>

                <div>
                  <p>Total Orders</p>

                  <h2>
                    {dashboard?.totalOrders ?? 0}
                  </h2>
                </div>

              </div>
            </div>


            {/* REVENUE */}

            <div className="col-md-6 col-xl-3">
              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  💰
                </div>

                <div>
                  <p>Total Revenue</p>

                  <h2>
                    ₹
                    {Number(
                      dashboard?.totalRevenue ?? 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>
            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="admin-section-card mt-5">

            <div className="admin-section-header">

              <div>
                <h3>
                  Quick Actions
                </h3>

                <p>
                  Manage your store from one place.
                </p>
              </div>

            </div>


            <div className="row g-3">

              <div className="col-md-6 col-lg-3">

                <Link
                  to="/admin/products"
                  className="admin-action-card"
                >
                  <span>📦</span>

                  <strong>
                    Manage Products
                  </strong>

                  <small>
                    Add, edit and delete products
                  </small>
                </Link>

              </div>


              <div className="col-md-6 col-lg-3">

                <Link
                  to="/admin/categories"
                  className="admin-action-card"
                >
                  <span>🗂️</span>

                  <strong>
                    Manage Categories
                  </strong>

                  <small>
                    Manage product categories
                  </small>
                </Link>

              </div>


              <div className="col-md-6 col-lg-3">

                <Link
                  to="/admin/users"
                  className="admin-action-card"
                >
                  <span>👥</span>

                  <strong>
                    Manage Users
                  </strong>

                  <small>
                    View and manage customers
                  </small>
                </Link>

              </div>


              <div className="col-md-6 col-lg-3">

                <Link
                  to="/admin/orders"
                  className="admin-action-card"
                >
                  <span>🛒</span>

                  <strong>
                    Manage Orders
                  </strong>

                  <small>
                    View and update orders
                  </small>
                </Link>

              </div>

            </div>

          </div>


          {/* ORDER STATUS */}

          <div className="admin-section-card mt-4">

            <div className="admin-section-header">

              <div>
                <h3>
                  Order Overview
                </h3>

                <p>
                  Current order status breakdown.
                </p>
              </div>

            </div>


            <div className="row g-3">


              {/* PLACED */}

              <div className="col-sm-6 col-lg-3">

                <div className="admin-order-stat">

                  <span>
                    📦
                  </span>

                  <div>
                    <small>
                      Placed
                    </small>

                    <strong>
                      {getOrderCount("PLACED")}
                    </strong>
                  </div>

                </div>

              </div>


              {/* CONFIRMED */}

              <div className="col-sm-6 col-lg-3">

                <div className="admin-order-stat">

                  <span>
                    ✅
                  </span>

                  <div>
                    <small>
                      Confirmed
                    </small>

                    <strong>
                      {getOrderCount("CONFIRMED")}
                    </strong>
                  </div>

                </div>

              </div>


              {/* SHIPPED */}

              <div className="col-sm-6 col-lg-3">

                <div className="admin-order-stat">

                  <span>
                    🚚
                  </span>

                  <div>
                    <small>
                      Shipped
                    </small>

                    <strong>
                      {getOrderCount("SHIPPED")}
                    </strong>
                  </div>

                </div>

              </div>


              {/* DELIVERED */}

              <div className="col-sm-6 col-lg-3">

                <div className="admin-order-stat">

                  <span>
                    🎉
                  </span>

                  <div>
                    <small>
                      Delivered
                    </small>

                    <strong>
                      {getOrderCount("DELIVERED")}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* MONTHLY REVENUE */}

          <div className="admin-section-card mt-4">

            <div className="admin-section-header">

              <div>
                <h3>
                  Monthly Revenue
                </h3>

                <p>
                  Revenue generated during each month.
                </p>
              </div>

            </div>


            {monthlyRevenue.length === 0 ? (

              <div className="admin-empty-state">

                <div>
                  📊
                </div>

                <p>
                  No revenue data available.
                </p>

              </div>

            ) : (

              <div className="monthly-revenue-list">

                {monthlyRevenue.map(
                  (item, index) => (

                    <div
                      className="monthly-revenue-row"
                      key={`${item.year}-${item.month}-${index}`}
                    >

                      <span>
                        {formatMonth(
                          item.year,
                          item.month
                        )}
                      </span>

                      <strong>
                        ₹
                        {Number(
                          item.revenue ?? 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>
      </section>

    </main>
  );
}

export default AdminDashboard;