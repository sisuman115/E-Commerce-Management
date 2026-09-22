import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!token;
  const isAdmin = role === "ADMIN";

  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(trimmedSearch)}`);

    setShowSearch(false);
  };

  const handleSearchToggle = () => {
    setShowSearch((current) => !current);

    if (showSearch) {
      setSearchText("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Shop<span className="text-primary">Ease</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  Orders
                </Link>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <div className="navbar-search-wrapper">
              <button
                type="button"
                className="navbar-search-button"
                onClick={handleSearchToggle}
                title="Search products"
                aria-label="Search products"
              >
                <FiSearch />
              </button>

              {showSearch && (
                <form className="navbar-search-form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="navbar-search-input"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    autoFocus
                  />

                  <button type="submit" className="navbar-search-submit">
                    Search
                  </button>
                </form>
              )}
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  to="/account"
                  className="navbar-icon-link"
                  title="Account"
                  aria-label="Account"
                >
                  <FiUser />
                </Link>

                <Link
                  to="/wishlist"
                  className="navbar-icon-link"
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <FiHeart />
                </Link>

                <Link
                  to="/cart"
                  className="navbar-icon-link"
                  title="Cart"
                  aria-label="Cart"
                >
                  <FiShoppingCart />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>

                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
