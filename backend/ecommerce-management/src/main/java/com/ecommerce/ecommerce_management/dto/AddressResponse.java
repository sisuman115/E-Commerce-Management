package com.ecommerce.ecommerce_management.dto;

public class AddressResponse {

    private Long id;
    private String fullName;
    private String phone;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;

    public AddressResponse(
            Long id,
            String fullName,
            String phone,
            String addressLine,
            String city,
            String state,
            String pincode,
            Boolean isDefault) {

        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }
}