import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 6) {
      errors.password = "Password must contain at least 6 characters.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("Registration successful. Please login.");

      navigate("/login");
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      if (responseData?.errors) {
        setFieldErrors(responseData.errors);
      }

      setError(
        responseData?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-card">

          <div className="auth-header">
            <div className="auth-icon">🛍️</div>

            <h1>Create Account</h1>

            <p>
              Create your account and start shopping.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="auth-form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={fieldErrors.name ? "is-invalid" : ""}
                disabled={loading}
              />

              {fieldErrors.name && (
                <small className="auth-field-error">
                  {fieldErrors.name}
                </small>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={fieldErrors.email ? "is-invalid" : ""}
                disabled={loading}
              />

              {fieldErrors.email && (
                <small className="auth-field-error">
                  {fieldErrors.email}
                </small>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={fieldErrors.password ? "is-invalid" : ""}
                disabled={loading}
              />

              {fieldErrors.password && (
                <small className="auth-field-error">
                  {fieldErrors.password}
                </small>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={
                  fieldErrors.confirmPassword
                    ? "is-invalid"
                    : ""
                }
                disabled={loading}
              />

              {fieldErrors.confirmPassword && (
                <small className="auth-field-error">
                  {fieldErrors.confirmPassword}
                </small>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>

            <Link to="/login">
              Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Register;