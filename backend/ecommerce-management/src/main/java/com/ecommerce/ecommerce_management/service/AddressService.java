package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.AddressRequest;
import com.ecommerce.ecommerce_management.dto.AddressResponse;
import com.ecommerce.ecommerce_management.entity.Address;
import com.ecommerce.ecommerce_management.entity.User;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.AddressRepository;
import com.ecommerce.ecommerce_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository,
                          UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<Address> existingAddresses =
                    addressRepository.findByUserId(user.getId());

            for (Address address : existingAddresses) {
                address.setIsDefault(false);
            }

            addressRepository.saveAll(existingAddresses);
        }

        Address address = new Address();

        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setIsDefault(
                Boolean.TRUE.equals(request.getIsDefault())
        );

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }

    public List<AddressResponse> getMyAddresses(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AddressResponse mapToResponse(Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhone(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getIsDefault()
        );
    }

    @Transactional
    public AddressResponse updateAddress(
            String email,
            Long addressId,
            AddressRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<Address> existingAddresses =
                    addressRepository.findByUserId(user.getId());

            for (Address existingAddress : existingAddresses) {
                existingAddress.setIsDefault(false);
            }

            addressRepository.saveAll(existingAddresses);
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setIsDefault(
                Boolean.TRUE.equals(request.getIsDefault())
        );

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }

    public void deleteAddress(String email, Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefaultAddress(
            String email,
            Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        List<Address> existingAddresses =
                addressRepository.findByUserId(user.getId());

        for (Address existingAddress : existingAddresses) {
            existingAddress.setIsDefault(false);
        }

        addressRepository.saveAll(existingAddresses);

        address.setIsDefault(true);

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }
}