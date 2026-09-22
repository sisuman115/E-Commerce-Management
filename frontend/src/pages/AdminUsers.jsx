import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [roleLoadingId, setRoleLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users");

      setUsers(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const handleChangeRole = async (user) => {
    const newRole =
      user.role === "ADMIN"
        ? "CUSTOMER"
        : "ADMIN";

    const confirmed = window.confirm(
      `Change "${user.name}" role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRoleLoadingId(user.id);

      const response = await api.put(
        `/api/users/${user.id}/role`,
        null,
        {
          params: {
            role: newRole,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? response.data
            : item
        )
      );

      alert("User role updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setRoleLoadingId(null);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(user.id);

      await api.delete(`/api/users/${user.id}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item.id !== user.id
        )
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="admin-users-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="admin-users-header">

        <div className="container">

          <div className="admin-users-heading-row">

            <div>

              <span className="section-badge">
                ADMIN PANEL
              </span>

              <h1 className="admin-users-title">
                User Management
              </h1>

              <p className="admin-users-description">
                View, manage roles and manage registered users.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          USERS
      ====================================== */}

      <section className="admin-users-content">

        <div className="container">

          {/* LOADING */}

          {loading && (
            <div className="admin-users-loading">

              <div className="spinner-border text-primary"></div>

              <p>Loading users...</p>

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
            users.length === 0 && (
              <div className="admin-users-empty">

                <div className="admin-empty-icon">
                  👥
                </div>

                <h3>No Users Found</h3>

                <p>
                  There are currently no registered users.
                </p>

              </div>
            )}

          {/* USERS TABLE */}

          {!loading &&
            !error &&
            users.length > 0 && (

              <div className="admin-users-table-card">

                <div className="admin-users-table-header">

                  <div>

                    <h3>All Users</h3>

                    <p>
                      {users.length} users registered
                    </p>

                  </div>

                </div>

                <div className="table-responsive">

                  <table className="table admin-users-table">

                    <thead>

                      <tr>

                        <th>User</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th className="text-end">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {users.map((user) => (

                        <tr key={user.id}>

                          {/* USER */}

                          <td>

                            <div className="admin-user-info">

                              <div className="admin-user-avatar">
                                {user.name
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </div>

                              <div>

                                <strong>
                                  {user.name}
                                </strong>

                                <small>
                                  ID: {user.id}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td>

                            <span className="admin-user-email">
                              {user.email}
                            </span>

                          </td>

                          {/* ROLE */}

                          <td>

                            <span
                              className={
                                user.role === "ADMIN"
                                  ? "admin-user-role-badge admin"
                                  : "admin-user-role-badge customer"
                              }
                            >
                              {user.role}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="admin-user-actions">

                              <button
                                type="button"
                                className="admin-table-button role"
                                onClick={() =>
                                  handleChangeRole(user)
                                }
                                disabled={
                                  roleLoadingId === user.id
                                }
                                title="Change role"
                              >
                                {roleLoadingId === user.id
                                  ? "..."
                                  : "🔄"}
                              </button>

                              <button
                                type="button"
                                className="admin-table-button delete"
                                onClick={() =>
                                  handleDeleteUser(user)
                                }
                                disabled={
                                  deletingId === user.id
                                }
                                title="Delete user"
                              >
                                {deletingId === user.id
                                  ? "..."
                                  : "🗑️"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

        </div>

      </section>

      {/* ======================================
          BACK TO DASHBOARD
      ====================================== */}

      <div className="container">

        <div className="admin-users-bottom">

          <Link
            to="/admin"
            className="admin-back-link"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

    </main>
  );
}

export default AdminUsers;