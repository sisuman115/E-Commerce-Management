import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
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

      const response = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      const redirectPath = location.state?.from || "/";

      navigate(redirectPath, { replace: true });

      window.location.reload();
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      if (responseData?.errors) {
        setFieldErrors(responseData.errors);
      }

      setError(
        responseData?.message ||
          "Invalid email or password."
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
            <div className="auth-icon">🔐</div>

            <h1>Welcome Back</h1>

            <p>
              Login to continue shopping.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

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
                placeholder="Enter your password"
                className={fieldErrors.password ? "is-invalid" : ""}
                disabled={loading}
              />

              {fieldErrors.password && (
                <small className="auth-field-error">
                  {fieldErrors.password}
                </small>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Login;