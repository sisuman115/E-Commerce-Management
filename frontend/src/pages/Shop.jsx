import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { getProductImage } from "../assets/products/productImages";

function Shop() {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);

  const [wishlistLoading, setWishlistLoading] = useState(null);

  /* ===================================================== */
  /* FETCH PRODUCTS / SEARCH PRODUCTS */
  /* ===================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        if (searchQuery.trim()) {
          response = await api.get("/api/products/search", {
            params: {
              name: searchQuery.trim(),
            },
          });
        } else {
          response = await api.get("/api/products");
        }

        setProducts(response.data);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to load products.");

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  /* ===================================================== */
  /* FETCH CATEGORIES */
  /* ===================================================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoryError("");

        const response = await api.get("/api/categories");

        setCategories(response.data);
      } catch (error) {
        console.error(error);

        setCategoryError(
          error.response?.data?.message || "Failed to load categories.",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ===================================================== */
  /* WISHLIST */
  /* ===================================================== */

  const handleWishlist = async (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setWishlistLoading(product.id);

      if (product.isWishlisted) {
        await api.delete(`/api/wishlist/items/${product.id}`);

        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  isWishlisted: false,
                }
              : item,
          ),
        );
      } else {
        await api.post(`/api/wishlist/items/${product.id}`);

        setProducts((currentProducts) =>
          currentProducts.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  isWishlisted: true,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update wishlist.");
    } finally {
      setWishlistLoading(null);
    }
  };

  /* ===================================================== */
  /* CATEGORY FILTER */
  /* ===================================================== */

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => String(product.categoryId) === String(selectedCategory),
      )
    : products;

  /* ===================================================== */
  /* SORT PRODUCTS */
  /* ===================================================== */

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return Number(a.price) - Number(b.price);
    }

    if (sortBy === "price-high") {
      return Number(b.price) - Number(a.price);
    }

    return 0;
  });

  /* ===================================================== */
  /* RENDER */
  /* ===================================================== */

  return (
    <main className="shop-page">
      {/* ================================================= */}
      {/* SHOP HEADER */}
      {/* ================================================= */}

      <section className="shop-header">
        <div className="container text-center">
          <span className="section-badge">OUR STORE</span>

          <h1 className="shop-title">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Shop All Products"}
          </h1>

          <p className="shop-description">
            {searchQuery
              ? "Here are the products matching your search."
              : "Explore our collection of quality products and find exactly what you're looking for."}
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRODUCTS AREA */}
      {/* ================================================= */}

      <section className="shop-products py-5">
        <div className="container">
          <div className="row">
            {/* ============================================= */}
            {/* SIDEBAR */}
            {/* ============================================= */}

            <div className="col-lg-3 mb-4">
              <div className="shop-sidebar">
                <h5>Filters</h5>

                <hr />

                <h6>Categories</h6>

                <div className="category-filter">
                  {/* ALL PRODUCTS */}

                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                    />

                    <span>All Products</span>
                  </label>

                  {/* CATEGORY LOADING */}

                  {categoriesLoading && (
                    <small className="text-muted d-block mt-2">
                      Loading categories...
                    </small>
                  )}

                  {/* CATEGORY ERROR */}

                  {!categoriesLoading && categoryError && (
                    <small className="text-danger d-block mt-2">
                      {categoryError}
                    </small>
                  )}

                  {/* DYNAMIC CATEGORIES */}

                  {!categoriesLoading &&
                    !categoryError &&
                    categories.map((category) => (
                      <label key={category.id}>
                        <input
                          type="checkbox"
                          checked={
                            String(selectedCategory) === String(category.id)
                          }
                          onChange={() =>
                            setSelectedCategory(
                              String(selectedCategory) === String(category.id)
                                ? ""
                                : String(category.id),
                            )
                          }
                        />

                        <span>{category.name}</span>
                      </label>
                    ))}
                </div>

                {/* ========================================= */}
                {/* PRICE RANGE */}
                {/* ========================================= */}

                <h6 className="mt-4">Price Range</h6>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100000"
                  disabled
                />

                <div className="price-range">
                  <span>₹0</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>

            {/* ============================================= */}
            {/* PRODUCT AREA */}
            {/* ============================================= */}

            <div className="col-lg-9">
              <div className="shop-toolbar">
                <p className="mb-0">
                  Showing <strong>{sortedProducts.length}</strong>{" "}
                  {searchQuery ? "matching products" : "products"}
                </p>

                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Sort by: Featured</option>

                  <option value="price-low">Price: Low to High</option>

                  <option value="price-high">Price: High to Low</option>

                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="row g-4">
                {/* ========================================= */}
                {/* LOADING */}
                {/* ========================================= */}

                {loading && (
                  <div className="col-12 text-center py-5">
                    <p>
                      {searchQuery
                        ? "Searching products..."
                        : "Loading products..."}
                    </p>
                  </div>
                )}

                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

                {error && (
                  <div className="col-12 text-center py-5">
                    <p className="text-danger">{error}</p>
                  </div>
                )}

                {/* ========================================= */}
                {/* EMPTY */}
                {/* ========================================= */}

                {!loading && !error && sortedProducts.length === 0 && (
                  <div className="col-12 text-center py-5">
                    <div className="shop-empty-state">
                      <div className="shop-empty-icon">🔍</div>

                      <h5>
                        {searchQuery
                          ? "No products found"
                          : "No products available"}
                      </h5>

                      <p className="text-muted mb-0">
                        {searchQuery
                          ? `We couldn't find any products matching "${searchQuery}".`
                          : "There are no products to display for this category."}
                      </p>
                    </div>
                  </div>
                )}

                {/* ========================================= */}
                {/* PRODUCTS */}
                {/* ========================================= */}

                {!loading &&
                  !error &&
                  sortedProducts.map((product) => (
                    <div className="col-sm-6 col-xl-4" key={product.id}>
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
                            <div className="product-placeholder">🛍️</div>
                          )}

                          {/* WISHLIST */}

                          <button
                            type="button"
                            className={`wishlist-btn ${
                              product.isWishlisted ? "active" : ""
                            }`}
                            disabled={wishlistLoading === product.id}
                            onClick={(event) => handleWishlist(event, product)}
                            aria-label={
                              product.isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            {wishlistLoading === product.id
                              ? "..."
                              : product.isWishlisted
                                ? "♥"
                                : "♡"}
                          </button>
                        </div>

                        <div className="product-info">
                          <small>
                            {product.categoryName || "Uncategorized"}
                          </small>

                          <h5>{product.name}</h5>

                          <div className="product-rating">
                            ⭐⭐⭐⭐⭐
                            <span>({product.reviewCount || 0})</span>
                          </div>

                          <div className="product-bottom">
                            <strong>
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </strong>

                            <button
                              type="button"
                              className="cart-btn"
                              onClick={(event) => event.preventDefault()}
                            >
                              🛒
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;
