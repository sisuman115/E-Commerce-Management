import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setName("");
    setEditingId(null);
    setFormError("");
  };

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  const handleAddCategory = () => {
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // EDIT CATEGORY
  // ==========================================

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setName(category.name || "");
    setFormError("");
    setShowForm(true);
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        await api.put(
          `/api/categories/${editingId}`,
          null,
          {
            params: {
              name: trimmedName,
            },
          }
        );

        alert("Category updated successfully.");
      } else {
        await api.post(
          "/api/categories",
          null,
          {
            params: {
              name: trimmedName,
            },
          }
        );

        alert("Category added successfully.");
      }

      setShowForm(false);
      resetForm();

      await fetchCategories();
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      setFormError(
        responseData?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);

      await api.delete(
        `/api/categories/${category.id}`
      );

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) => item.id !== category.id
        )
      );

      alert("Category deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="admin-categories-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="admin-categories-header">
        <div className="container">

          <div className="admin-categories-heading-row">

            <div>
              <span className="section-badge">
                ADMIN PANEL
              </span>

              <h1 className="admin-categories-title">
                Category Management
              </h1>

              <p className="admin-categories-description">
                Add, edit and manage your store categories.
              </p>
            </div>

            <button
              type="button"
              className="admin-add-category-button"
              onClick={handleAddCategory}
            >
              + Add Category
            </button>

          </div>

        </div>
      </section>

      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      {showForm && (
        <section className="admin-category-form-section">

          <div className="container">

            <div className="admin-category-form-card">

              <div className="admin-category-form-header">

                <div>
                  <h3>
                    {editingId
                      ? "Edit Category"
                      : "Add New Category"}
                  </h3>

                  <p>
                    Enter the category name below.
                  </p>
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

                <div className="row">

                  <div className="col-md-8">

                    <label className="admin-form-label">
                      Category Name
                    </label>

                    <input
                      type="text"
                      className="form-control admin-form-input"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter category name"
                      disabled={saving}
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
                        ? "Update Category"
                        : "Add Category"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </section>
      )}

      {/* ======================================
          CATEGORIES
      ====================================== */}

      <section className="admin-categories-content">

        <div className="container">

          {/* LOADING */}

          {loading && (
            <div className="admin-categories-loading">

              <div className="spinner-border text-primary"></div>

              <p>Loading categories...</p>

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
            categories.length === 0 && (
              <div className="admin-categories-empty">

                <div className="admin-empty-icon">
                  🗂️
                </div>

                <h3>No Categories Found</h3>

                <p>
                  Start by adding your first product category.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddCategory}
                >
                  + Add Category
                </button>

              </div>
            )}

          {/* CATEGORY TABLE */}

          {!loading &&
            !error &&
            categories.length > 0 && (

              <div className="admin-categories-table-card">

                <div className="admin-categories-table-header">

                  <div>
                    <h3>All Categories</h3>

                    <p>
                      {categories.length} categories in your store
                    </p>
                  </div>

                </div>

                <div className="table-responsive">

                  <table className="table admin-categories-table">

                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Products</th>
                        <th className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {categories.map((category) => (

                        <tr key={category.id}>

                          {/* CATEGORY */}

                          <td>

                            <div className="admin-category-info">

                              <div className="admin-category-icon">
                                🗂️
                              </div>

                              <div>
                                <strong>
                                  {category.name}
                                </strong>

                                <small>
                                  ID: {category.id}
                                </small>
                              </div>

                            </div>

                          </td>

                          {/* PRODUCT COUNT */}

                          <td>

                            <span className="admin-product-count-badge">

                              {category.productCount}

                              {category.productCount === 1
                                ? " product"
                                : " products"}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="admin-category-actions">

                              <button
                                type="button"
                                className="admin-table-button edit"
                                onClick={() =>
                                  handleEditCategory(category)
                                }
                                title="Edit category"
                              >
                                ✏️
                              </button>

                              <button
                                type="button"
                                className="admin-table-button delete"
                                onClick={() =>
                                  handleDeleteCategory(category)
                                }
                                disabled={
                                  deletingId === category.id
                                }
                                title="Delete category"
                              >
                                {deletingId === category.id
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

        <div className="admin-categories-bottom">

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

export default AdminCategories;