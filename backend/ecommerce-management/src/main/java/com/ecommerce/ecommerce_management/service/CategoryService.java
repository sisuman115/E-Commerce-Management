package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.entity.Category;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce_management.repository.ProductRepository;
import com.ecommerce.ecommerce_management.dto.CategoryResponse;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository) {

        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public CategoryResponse createCategory(String name) {

        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }

        Category category = new Category(name);

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CategoryResponse updateCategory(Long categoryId, String name) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (categoryRepository.existsByName(name)
                && !category.getName().equalsIgnoreCase(name)) {
            throw new RuntimeException("Category already exists");
        }

        category.setName(name);

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    public void deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (productRepository.existsByCategoryId(categoryId)) {
            throw new RuntimeException(
                    "Category cannot be deleted because products are using it"
            );
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {

        long productCount =
                productRepository.countByCategoryId(category.getId());

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                productCount
        );
    }
}