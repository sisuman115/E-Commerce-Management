package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.ecommerce_management.entity.Role;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    @Query("""
        SELECT u.role, COUNT(u)
        FROM User u
        GROUP BY u.role
        ORDER BY u.role
        """)
    List<Object[]> getUserRoleCounts();
}