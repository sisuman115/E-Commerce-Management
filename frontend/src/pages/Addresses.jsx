import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultLoadingId, setDefaultLoadingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  /* ================================================= */
  /* LOAD ADDRESSES */
  /* ================================================= */

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/addresses");

      setAddresses(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================================================= */
  /* FORM CHANGE */
  /* ================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================================================= */
  /* OPEN ADD FORM */
  /* ================================================= */

  const handleAddNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  /* ================================================= */
  /* OPEN EDIT FORM */
  /* ================================================= */

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      isDefault: Boolean(address.isDefault),
    });

    setFormError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================================= */
  /* CANCEL FORM */
  /* ================================================= */

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  /* ================================================= */
  /* VALIDATE FORM */
  /* ================================================= */

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.addressLine.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setFormError(
        "Phone number must contain exactly 10 digits."
      );
      return false;
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      setFormError(
        "Pincode must contain exactly 6 digits."
      );
      return false;
    }

    return true;
  };

  /* ================================================= */
  /* SAVE ADDRESS */
  /* ================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        await api.put(
          `/api/addresses/${editingId}`,
          form
        );
      } else {
        await api.post(
          "/api/addresses",
          form
        );
      }

      await fetchAddresses();

      handleCancel();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================================= */
  /* DELETE ADDRESS */
  /* ================================================= */

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(addressId);

      await api.delete(
        `/api/addresses/${addressId}`
      );

      setAddresses((current) =>
        current.filter(
          (address) => address.id !== addressId
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ================================================= */
  /* SET DEFAULT */
  /* ================================================= */

  const handleSetDefault = async (addressId) => {
    try {
      setDefaultLoadingId(addressId);

      const response = await api.put(
        `/api/addresses/${addressId}/default`
      );

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault:
            address.id === response.data.id,
        }))
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to set default address."
      );
    } finally {
      setDefaultLoadingId(null);
    }
  };

  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  if (loading) {
    return (
      <main className="addresses-page">

        <section className="addresses-hero">
          <div className="container">

            <span className="section-badge">
              DELIVERY
            </span>

            <h1>My Addresses</h1>

            <p>
              Manage your saved delivery addresses.
            </p>

          </div>
        </section>

        <section className="addresses-section">
          <div className="container">

            <div className="addresses-loading">

              <div className="spinner-border text-primary" />

              <p>
                Loading your addresses...
              </p>

            </div>

          </div>
        </section>

      </main>
    );
  }

  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (error) {
    return (
      <main className="addresses-page">

        <section className="addresses-hero">
          <div className="container">

            <span className="section-badge">
              DELIVERY
            </span>

            <h1>My Addresses</h1>

            <p>
              Manage your saved delivery addresses.
            </p>

          </div>
        </section>

        <section className="addresses-section">

          <div className="container">

            <div className="addresses-empty-card">

              <div className="address-empty-icon">
                ⚠️
              </div>

              <h3>
                Unable to load addresses
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchAddresses}
              >
                Try Again
              </button>

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* ================================================= */
  /* PAGE */
  /* ================================================= */

  return (
    <main className="addresses-page">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="addresses-hero">

        <div className="container">

          <span className="section-badge">
            DELIVERY
          </span>

          <div className="addresses-heading-row">

            <div>

              <h1>
                My Addresses
              </h1>

              <p>
                Manage your saved delivery addresses.
              </p>

            </div>

            <button
              type="button"
              className="address-add-button"
              onClick={handleAddNew}
            >
              + Add New Address
            </button>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="addresses-section">

        <div className="container">


          {/* ================================================= */}
          {/* ADD / EDIT FORM */}
          {/* ================================================= */}

          {showForm && (

            <div className="address-form-card">

              <div className="address-form-header">

                <div>

                  <span className="card-eyebrow">
                    {editingId
                      ? "EDIT ADDRESS"
                      : "NEW ADDRESS"}
                  </span>

                  <h2>
                    {editingId
                      ? "Edit Delivery Address"
                      : "Add Delivery Address"}
                  </h2>

                </div>

                <button
                  type="button"
                  className="address-close-button"
                  onClick={handleCancel}
                >
                  ×
                </button>

              </div>


              <form onSubmit={handleSubmit}>

                <div className="row g-3">

                  {/* Full Name */}

                  <div className="col-md-6">

                    <label className="address-form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      className="form-control address-input"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />

                  </div>


                  {/* Phone */}

                  <div className="col-md-6">

                    <label className="address-form-label">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      className="form-control address-input"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength="10"
                    />

                  </div>


                  {/* Address */}

                  <div className="col-12">

                    <label className="address-form-label">
                      Address
                    </label>

                    <textarea
                      name="addressLine"
                      className="form-control address-input"
                      value={form.addressLine}
                      onChange={handleChange}
                      placeholder="House number, street, area"
                      rows="3"
                    />

                  </div>


                  {/* City */}

                  <div className="col-md-4">

                    <label className="address-form-label">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      className="form-control address-input"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                    />

                  </div>


                  {/* State */}

                  <div className="col-md-4">

                    <label className="address-form-label">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      className="form-control address-input"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                    />

                  </div>


                  {/* Pincode */}

                  <div className="col-md-4">

                    <label className="address-form-label">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      className="form-control address-input"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                    />

                  </div>


                  {/* Default */}

                  <div className="col-12">

                    <label className="address-default-checkbox">

                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={form.isDefault}
                        onChange={handleChange}
                      />

                      <span>
                        Make this my default address
                      </span>

                    </label>

                  </div>


                  {/* Error */}

                  {formError && (

                    <div className="col-12">

                      <div className="address-form-error">
                        {formError}
                      </div>

                    </div>

                  )}


                  {/* Buttons */}

                  <div className="col-12">

                    <div className="address-form-actions">

                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleCancel}
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
                          ? "Update Address"
                          : "Save Address"}
                      </button>

                    </div>

                  </div>

                </div>

              </form>

            </div>

          )}


          {/* ================================================= */}
          {/* EMPTY STATE */}
          {/* ================================================= */}

          {addresses.length === 0 && !showForm && (

            <div className="addresses-empty-card">

              <div className="address-empty-icon">
                📍
              </div>

              <h3>
                No saved addresses
              </h3>

              <p>
                Add a delivery address to make checkout
                faster and easier.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddNew}
              >
                + Add Your First Address
              </button>

            </div>

          )}


          {/* ================================================= */}
          {/* ADDRESS LIST */}
          {/* ================================================= */}

          {addresses.length > 0 && (

            <div className="row g-4">

              {addresses.map((address) => (

                <div
                  className="col-md-6"
                  key={address.id}
                >

                  <article
                    className={`address-card ${
                      address.isDefault
                        ? "default"
                        : ""
                    }`}
                  >

                    {/* Header */}

                    <div className="address-card-header">

                      <div className="address-title-area">

                        <div className="address-icon">
                          📍
                        </div>

                        <div>

                          <h3>
                            {address.fullName}
                          </h3>

                          <span>
                            {address.phone}
                          </span>

                        </div>

                      </div>


                      {address.isDefault && (

                        <span className="default-address-badge">
                          DEFAULT
                        </span>

                      )}

                    </div>


                    <div className="address-divider" />


                    {/* Address */}

                    <div className="address-card-body">

                      <p className="address-line">
                        {address.addressLine}
                      </p>

                      <p className="address-location">
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                    </div>


                    {/* Actions */}

                    <div className="address-card-footer">

                      {!address.isDefault ? (

                        <button
                          type="button"
                          className="set-default-button"
                          disabled={
                            defaultLoadingId ===
                            address.id
                          }
                          onClick={() =>
                            handleSetDefault(
                              address.id
                            )
                          }
                        >
                          {defaultLoadingId ===
                          address.id
                            ? "Setting..."
                            : "Set as Default"}
                        </button>

                      ) : (

                        <span className="default-text">
                          ✓ Default Address
                        </span>

                      )}


                      <div className="address-actions">

                        <button
                          type="button"
                          className="address-edit-button"
                          onClick={() =>
                            handleEdit(address)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="address-delete-button"
                          disabled={
                            deletingId ===
                            address.id
                          }
                          onClick={() =>
                            handleDelete(
                              address.id
                            )
                          }
                        >
                          {deletingId ===
                          address.id
                            ? "..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </article>

                </div>

              ))}

            </div>

          )}


          {/* ================================================= */}
          {/* BACK TO ACCOUNT */}
          {/* ================================================= */}

          <div className="addresses-bottom">

            <Link
              to="/account"
              className="addresses-back-link"
            >
              ← Back to Account
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Addresses;