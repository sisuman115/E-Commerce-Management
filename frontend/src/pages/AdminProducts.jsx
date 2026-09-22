import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [stockLoadingId, setStockLoadingId] = useState(null);

  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
    lowStockThreshold: "5",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/products");

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
      lowStockThreshold: "5",
    });

    setEditingId(null);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? "",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
      lowStockThreshold: product.lowStockThreshold ?? "5",
    });

    setFormError("");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.description.trim()) {
      return "Product description is required.";
    }

    if (form.price === "" || Number(form.price) < 0) {
      return "Please enter a valid price.";
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      return "Please enter a valid stock quantity.";
    }

    if (!form.categoryId) {
      return "Please select a category.";
    }

    if (form.lowStockThreshold === "" || Number(form.lowStockThreshold) < 0) {
      return "Please enter a valid low-stock threshold.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const requestData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl.trim() || null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        lowStockThreshold: form.lowStockThreshold
          ? Number(form.lowStockThreshold)
          : 0,
      };

      if (editingId) {
        await api.put(`/api/products/${editingId}`, requestData);

        alert("Product updated successfully.");
      } else {
        await api.post("/api/products", requestData);

        alert("Product added successfully.");
      }

      setShowForm(false);
      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      if (responseData?.errors) {
        const validationMessages = Object.values(responseData.errors);

        setFormError(validationMessages.join(" "));
      } else {
        setFormError(responseData?.message || "Failed to save product.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      await api.delete(`/api/products/${productId}`);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStock = async (product) => {
    const newStock = window.prompt(
      `Enter new stock quantity for "${product.name}":`,
      product.stock,
    );

    if (newStock === null) {
      return;
    }

    if (
      newStock.trim() === "" ||
      Number(newStock) < 0 ||
      !Number.isInteger(Number(newStock))
    ) {
      alert("Please enter a valid whole number for stock.");
      return;
    }

    try {
      setStockLoadingId(product.id);

      await api.put(`/api/products/${product.id}/stock`, null, {
        params: {
          quantity: Number(newStock),
        },
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: Number(newStock),
                isLowStock:
                  Number(newStock) <= Number(item.lowStockThreshold ?? 5),
              }
            : item,
        ),
      );

      alert("Stock updated successfully.");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to update stock.");
    } finally {
      setStockLoadingId(null);
    }
  };

  return (
    <main className="admin-products-page">
      {/* HEADER */}

      <section className="admin-products-header">
        <div className="container">
          <div className="admin-products-heading-row">
            <div>
              <span className="section-badge">ADMIN PANEL</span>

              <h1 className="admin-products-title">Product Management</h1>

              <p className="admin-products-description">
                Add, edit, delete and manage your store products.
              </p>
            </div>

            <button
              type="button"
              className="admin-add-product-button"
              onClick={handleAddProduct}
            >
              + Add Product
            </button>
          </div>
        </div>
      </section>

      {/* FORM */}

      {showForm && (
        <section className="admin-product-form-section">
          <div className="container">
            <div className="admin-product-form-card">
              <div className="admin-product-form-header">
                <div>
                  <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

                  <p>Enter the product information below.</p>
                </div>

                <button
                  type="button"
                  className="admin-form-close"
                  onClick={handleCancelForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* NAME */}

                  <div className="col-md-6">
                    <label className="admin-form-label">Product Name</label>

                    <input
                      type="text"
                      name="name"
                      className="form-control admin-form-input"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div className="col-md-6">
                    <label className="admin-form-label">Category</label>

                    <select
                      name="categoryId"
                      className="form-select admin-form-input"
                      value={form.categoryId}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="col-12">
                    <label className="admin-form-label">Description</label>

                    <textarea
                      name="description"
                      className="form-control admin-form-input"
                      rows="4"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* PRICE */}

                  <div className="col-md-4">
                    <label className="admin-form-label">Price</label>

                    <input
                      type="number"
                      name="price"
                      className="form-control admin-form-input"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>

                  {/* STOCK */}

                  <div className="col-md-4">
                    <label className="admin-form-label">Stock</label>

                    <input
                      type="number"
                      name="stock"
                      className="form-control admin-form-input"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  {/* LOW STOCK */}

                  <div className="col-md-4">
                    <label className="admin-form-label">
                      Low Stock Threshold
                    </label>

                    <input
                      type="number"
                      name="lowStockThreshold"
                      className="form-control admin-form-input"
                      min="0"
                      step="1"
                      value={form.lowStockThreshold}
                      onChange={handleChange}
                      placeholder="5"
                    />
                  </div>

                  {/* IMAGE URL */}

                  <div className="col-12">
                    <label className="admin-form-label">Image URL</label>

                    <input
                      type="text"
                      name="imageUrl"
                      className="form-control admin-form-input"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="alert alert-danger mt-4 mb-0">
                    {formError}
                  </div>
                )}

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCancelForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Product"
                        : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}

      <section className="admin-products-content">
        <div className="container">
          {loading && (
            <div className="admin-products-loading">
              <div className="spinner-border text-primary"></div>

              <p>Loading products...</p>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="admin-products-empty">
              <div className="admin-empty-icon">📦</div>

              <h3>No Products Found</h3>

              <p>Start by adding your first product.</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddProduct}
              >
                + Add Product
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="admin-products-table-card">
              <div className="admin-products-table-header">
                <div>
                  <h3>All Products</h3>

                  <p>{products.length} products in your store</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table admin-products-table">
                  <thead>
                    <tr>
                      <th>Product</th>

                      <th>Category</th>

                      <th>Price</th>

                      <th>Stock</th>

                      <th>Status</th>

                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        {/* PRODUCT */}

                        <td>
                          <div className="admin-product-info">
                            <div className="admin-product-image">
                              <span>🛍️</span>
                            </div>

                            <div>
                              <strong>{product.name}</strong>

                              <small>ID: {product.id}</small>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td>
                          <span className="admin-category-badge">
                            {product.categoryName || "Uncategorized"}
                          </span>
                        </td>

                        {/* PRICE */}

                        <td>
                          <strong>
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </strong>
                        </td>

                        {/* STOCK */}

                        <td>
                          <span
                            className={
                              product.isLowStock
                                ? "admin-stock-low"
                                : "admin-stock-normal"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          {product.isLowStock ? (
                            <span className="admin-status-badge low">
                              Low Stock
                            </span>
                          ) : product.stock === 0 ? (
                            <span className="admin-status-badge out">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="admin-status-badge available">
                              Available
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="admin-product-actions">
                            <button
                              type="button"
                              className="admin-table-button stock"
                              onClick={() => handleUpdateStock(product)}
                              disabled={stockLoadingId === product.id}
                              title="Update stock"
                            >
                              📦
                            </button>

                            <button
                              type="button"
                              className="admin-table-button edit"
                              onClick={() => handleEditProduct(product)}
                              title="Edit product"
                            >
                              ✏️
                            </button>

                            <button
                              type="button"
                              className="admin-table-button delete"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deletingId === product.id}
                              title="Delete product"
                            >
                              {deletingId === product.id ? "..." : "🗑️"}
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

      {/* BACK TO DASHBOARD */}

      <div className="container">
        <div className="admin-products-bottom">
          <Link to="/admin" className="admin-back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AdminProducts;
