package com.projectoop.services;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectoop.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    Category findByName(String name);
}