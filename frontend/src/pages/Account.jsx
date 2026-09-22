import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Account() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");

      const response = await api.get("/api/users/me");

      setProfile(response.data);
      setName(response.data.name || "");
    } catch (error) {
      setProfileError(
        error.response?.data?.message ||
          "Failed to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.put(
        `/api/users/me?name=${encodeURIComponent(name.trim())}`
      );

      setProfile(response.data);
      setName(response.data.name || "");
      setEditingProfile(false);

      alert("Profile updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPassword(true);

      await api.put("/api/users/me/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      alert("Password changed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return (
      <main className="account-page">
        <section className="account-hero">
          <div className="container">
            <span className="section-badge">
              MY ACCOUNT
            </span>

            <h1>Account</h1>

            <p>
              Manage your profile, security and shopping activity.
            </p>
          </div>
        </section>

        <section className="account-section">
          <div className="container">
            <div className="account-loading">
              <div className="spinner-border text-primary" />
              <p>Loading your account...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (profileError || !profile) {
    return (
      <main className="account-page">
        <section className="account-hero">
          <div className="container">
            <span className="section-badge">
              MY ACCOUNT
            </span>

            <h1>Account</h1>
          </div>
        </section>

        <section className="account-section">
          <div className="container">
            <div className="account-error-card">
              <div className="account-error-icon">
                ⚠️
              </div>

              <h3>Unable to load account</h3>

              <p>{profileError}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchProfile}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const firstLetter =
    profile.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <main className="account-page">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="account-hero">

        <div className="container">

          <span className="section-badge">
            MY ACCOUNT
          </span>

          <div className="account-heading">

            <div>
              <h1>Account</h1>

              <p>
                Manage your profile, security and shopping
                activity.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ACCOUNT CONTENT */}
      {/* ================================================= */}

      <section className="account-section">

        <div className="container">

          <div className="row g-4">

            {/* =========================================== */}
            {/* LEFT COLUMN */}
            {/* =========================================== */}

            <div className="col-lg-8">

              {/* PROFILE CARD */}

              <div className="account-card profile-card">

                <div className="account-card-header">

                  <div>
                    <span className="card-eyebrow">
                      PERSONAL INFORMATION
                    </span>

                    <h2>Profile</h2>
                  </div>

                  {!editingProfile && (
                    <button
                      type="button"
                      className="account-edit-button"
                      onClick={() =>
                        setEditingProfile(true)
                      }
                    >
                      ✏️ Edit
                    </button>
                  )}

                </div>


                <div className="profile-content">

                  <div className="profile-avatar">
                    {firstLetter}
                  </div>


                  <div className="profile-info">

                    <div className="profile-name-row">

                      <div>
                        <span className="profile-label">
                          NAME
                        </span>

                        <h3>{profile.name}</h3>
                      </div>

                      <span className="account-role-badge">
                        {profile.role}
                      </span>

                    </div>


                    <div className="profile-email">

                      <span className="profile-label">
                        EMAIL ADDRESS
                      </span>

                      <p>
                        {profile.email}
                      </p>

                    </div>

                  </div>

                </div>


                {editingProfile && (

                  <form
                    className="profile-edit-form"
                    onSubmit={handleProfileUpdate}
                  >

                    <div className="account-form-group">

                      <label htmlFor="profileName">
                        Full Name
                      </label>

                      <input
                        id="profileName"
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        placeholder="Enter your name"
                      />

                    </div>


                    <div className="profile-edit-actions">

                      <button
                        type="button"
                        className="account-cancel-button"
                        onClick={() => {
                          setName(profile.name || "");
                          setEditingProfile(false);
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={savingProfile}
                      >
                        {savingProfile
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                    </div>

                  </form>

                )}

              </div>


              {/* PASSWORD CARD */}

              <div className="account-card password-card">

                <div className="account-card-header">

                  <div>
                    <span className="card-eyebrow">
                      ACCOUNT SECURITY
                    </span>

                    <h2>Change Password</h2>
                  </div>

                  <div className="security-icon">
                    🔐
                  </div>

                </div>


                <p className="security-description">
                  Keep your account secure by using a strong
                  password that you don't use elsewhere.
                </p>


                <form
                  className="password-form"
                  onSubmit={handlePasswordChange}
                >

                  <div className="account-form-group">

                    <label htmlFor="currentPassword">
                      Current Password
                    </label>

                    <input
                      id="currentPassword"
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter current password"
                    />

                  </div>


                  <div className="row">

                    <div className="col-md-6">

                      <div className="account-form-group">

                        <label htmlFor="newPassword">
                          New Password
                        </label>

                        <input
                          id="newPassword"
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(
                              event.target.value
                            )
                          }
                          placeholder="Enter new password"
                        />

                      </div>

                    </div>


                    <div className="col-md-6">

                      <div className="account-form-group">

                        <label htmlFor="confirmPassword">
                          Confirm New Password
                        </label>

                        <input
                          id="confirmPassword"
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm new password"
                        />

                      </div>

                    </div>

                  </div>


                  <div className="password-form-footer">

                    <span>
                      Minimum 6 characters
                    </span>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={changingPassword}
                    >
                      {changingPassword
                        ? "Updating..."
                        : "Update Password"}
                    </button>

                  </div>

                </form>

              </div>

            </div>


            {/* =========================================== */}
            {/* RIGHT COLUMN */}
            {/* =========================================== */}

            <div className="col-lg-4">

              {/* QUICK LINKS */}

              <div className="account-card quick-links-card">

                <div className="account-card-header">

                  <div>
                    <span className="card-eyebrow">
                      QUICK ACCESS
                    </span>

                    <h2>My Account</h2>
                  </div>

                </div>


                <div className="account-links">

                  <Link
                    to="/orders"
                    className="account-link"
                  >

                    <div className="account-link-icon orders-icon">
                      📦
                    </div>

                    <div>
                      <strong>My Orders</strong>
                      <span>
                        Track your purchases
                      </span>
                    </div>

                    <span className="account-link-arrow">
                      →
                    </span>

                  </Link>


                  <Link
                    to="/wishlist"
                    className="account-link"
                  >

                    <div className="account-link-icon wishlist-icon">
                      ❤️
                    </div>

                    <div>
                      <strong>Wishlist</strong>
                      <span>
                        View saved products
                      </span>
                    </div>

                    <span className="account-link-arrow">
                      →
                    </span>

                  </Link>


                  <Link
                    to="/addresses"
                    className="account-link"
                  >

                    <div className="account-link-icon address-icon-small">
                      📍
                    </div>

                    <div>
                      <strong>Addresses</strong>
                      <span>
                        Manage delivery addresses
                      </span>
                    </div>

                    <span className="account-link-arrow">
                      →
                    </span>

                  </Link>

                </div>

              </div>


              {/* ACCOUNT INFO */}

              <div className="account-info-card">

                <div className="account-info-icon">
                  ✨
                </div>

                <div>
                  <h3>ShopEase Account</h3>

                  <p>
                    Your account gives you quick access
                    to orders, saved products and delivery
                    information.
                  </p>
                </div>

              </div>


              {/* LOGOUT */}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Account;