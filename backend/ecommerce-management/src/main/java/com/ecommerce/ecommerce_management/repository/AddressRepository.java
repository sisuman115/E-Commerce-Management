package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long addressId, Long userId);

    boolean existsByUserIdAndIsDefaultTrue(Long userId);
}