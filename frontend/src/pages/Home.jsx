import { Link } from "react-router-dom";
import heroImage from "../assets/hero-product.jpg";
import { getProductImage } from "../assets/products/productImages";

function Home() {
  const featuredProducts = [
    {
      id: 2,
      name: "iPhone 14 Pro",
      category: "Electronics",
      price: 99999,
      rating: 5,
      reviews: 24,
      badge: "POPULAR",
    },
    {
      id: 8,
      name: "Samsung Galaxy S24",
      category: "Electronics",
      price: 74999,
      rating: 5,
      reviews: 18,
      badge: "NEW",
    },
    {
      id: 10,
      name: "Nike Air Max 270",
      category: "Accessories",
      price: 12995,
      rating: 5,
      reviews: 15,
      badge: "TRENDING",
    },
    {
      id: 12,
      name: "Dell Inspiron 15 Laptop",
      category: "Electronics",
      price: 58990,
      rating: 5,
      reviews: 21,
      badge: "POPULAR",
    },
  ];

  return (
    <div>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 hero-content">
              <span className="hero-badge">✨ NEW COLLECTION</span>

              <h1 className="hero-title">
                Everything You Need,
                <span>All in One Place.</span>
              </h1>

              <p className="hero-description">
                Discover quality products, great deals, and a seamless
                shopping experience designed just for you.
              </p>

              <div className="hero-buttons">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  Shop Now →
                </Link>

                <a
                  href="#categories"
                  className="btn btn-outline-dark btn-lg"
                >
                  Explore Categories
                </a>
              </div>

              <div className="hero-features">
                <div>
                  <strong>10</strong>
                  <span>Products</span>
                </div>

                <div>
                  <strong>3</strong>
                  <span>Categories</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-image-wrapper">
                <img
                  src={heroImage}
                  alt="Shopping products"
                  className="img-fluid"
                />

                <div className="floating-card">
                  🛒 <strong>Start Shopping</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section
        id="categories"
        className="categories-section py-5"
      >
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">EXPLORE</span>

            <h2 className="section-title">
              Shop by Category
            </h2>

            <p className="section-description">
              Explore our wide range of products and find everything you need.
            </p>
          </div>

          <div className="row g-4">
            {/* ELECTRONICS */}

            <div className="col-md-4">
              <Link
                to="/shop?category=1"
                className="text-decoration-none text-dark"
              >
                <div className="category-card">
                  <div className="category-icon">💻</div>

                  <h4>Electronics</h4>

                  <p>
                    Discover the latest gadgets, devices, and accessories.
                  </p>

                  <span className="category-link">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>

            {/* CLOTHING */}

            <div className="col-md-4">
              <Link
                to="/shop?category=2"
                className="text-decoration-none text-dark"
              >
                <div className="category-card">
                  <div className="category-icon">👕</div>

                  <h4>Clothing</h4>

                  <p>
                    Find stylish clothing and comfortable everyday fashion.
                  </p>

                  <span className="category-link">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>

            {/* ACCESSORIES */}

            <div className="col-md-4">
              <Link
                to="/shop?category=3"
                className="text-decoration-none text-dark"
              >
                <div className="category-card">
                  <div className="category-icon">⌚</div>

                  <h4>Accessories</h4>

                  <p>
                    Complete your style with useful and modern accessories.
                  </p>

                  <span className="category-link">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FEATURED PRODUCTS */}
      {/* ================================================= */}

      <section className="featured-section py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="section-badge">SHOP NOW</span>

              <h2 className="section-title mb-2">
                Featured Products
              </h2>

              <p className="section-description m-0">
                Discover some of our most popular products.
              </p>
            </div>

            <Link
              to="/shop"
              className="view-all-btn text-decoration-none"
            >
              View All →
            </Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div
                className="col-sm-6 col-lg-3"
                key={product.id}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="product-card text-decoration-none"
                >
                  <div className="product-image">
                    {getProductImage(product.name) ? (
                      <img
                        src={getProductImage(product.name)}
                        alt={product.name}
                        className="product-image-real"
                      />
                    ) : (
                      <div className="product-placeholder">
                        🛍️
                      </div>
                    )}

                    <span className="product-badge">
                      {product.badge}
                    </span>
                  </div>

                  <div className="product-info">
                    <small>{product.category}</small>

                    <h5>{product.name}</h5>

                    <div className="product-rating">
                      ⭐⭐⭐⭐⭐
                      <span>({product.reviews})</span>
                    </div>

                    <div className="product-bottom">
                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      <span className="cart-btn">
                        🛒
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PROMOTIONAL BANNER */}
      {/* ================================================= */}

      <section className="promo-section py-5">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <span className="promo-badge">
                SPECIAL OFFER
              </span>

              <h2>
                Upgrade Your Shopping Experience
              </h2>

              <p>
                Get amazing products at great prices. Shop now and
                discover exclusive deals.
              </p>

              <Link
                to="/shop"
                className="btn btn-primary"
              >
                Shop Deals →
              </Link>
            </div>

            <div className="promo-decoration">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* BENEFITS */}
      {/* ================================================= */}

      <section className="benefits-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="benefit-card">
                <div className="benefit-icon">🚚</div>

                <h5>Fast Delivery</h5>

                <p>
                  Get your orders delivered quickly and conveniently.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="benefit-card">
                <div className="benefit-icon">🔒</div>

                <h5>Secure Account</h5>

                <p>
                  Your account and shopping experience are protected.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="benefit-card">
                <div className="benefit-icon">🛍️</div>

                <h5>Easy Checkout</h5>

                <p>
                  Simple cart and address-based checkout experience.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="benefit-card">
                <div className="benefit-icon">📦</div>

                <h5>Order Tracking</h5>

                <p>
                  Keep track of your orders and their delivery status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* NEWSLETTER */}
      {/* ================================================= */}

      <section className="newsletter-section py-5">
        <div className="container">
          <div className="newsletter-content text-center">
            <span className="section-badge">
              STAY UPDATED
            </span>

            <h2 className="section-title">
              Get the Latest Updates
            </h2>

            <p className="section-description">
              Subscribe to receive updates about new products and offers.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="footer-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h4>
                Shop<span className="text-primary">Ease</span>
              </h4>

              <p>
                A simple and modern e-commerce platform built with
                React and Spring Boot.
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h6>Quick Links</h6>

              <ul className="list-unstyled">
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/shop">Shop</Link>
                </li>

                <li>
                  <Link to="/wishlist">Wishlist</Link>
                </li>

                <li>
                  <Link to="/account">Account</Link>
                </li>
              </ul>
            </div>

            <div className="col-6 col-lg-3">
              <h6>Shopping</h6>

              <ul className="list-unstyled">
                <li>
                  <Link to="/shop?category=1">
                    Electronics
                  </Link>
                </li>

                <li>
                  <Link to="/shop?category=2">
                    Clothing
                  </Link>
                </li>

                <li>
                  <Link to="/shop?category=3">
                    Accessories
                  </Link>
                </li>

                <li>
                  <Link to="/cart">Cart</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-3">
              <h6>Contact</h6>

              <p className="mb-1">
                Nagercoil, Tamil Nadu
              </p>

              <p className="mb-1">
                support@shopease.com
              </p>

              <p className="mb-0">
                +91 98765 43210
              </p>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <p className="mb-0">
              © 2026 ShopEase. All rights reserved.
            </p>

            <p className="mb-0">
              Built with React & Spring Boot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;