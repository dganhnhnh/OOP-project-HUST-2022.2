package com.projectoop.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepo extends JpaRepository<Question, Long> {
    Question findByName(String name);
    Question findByText(String text);
    // Optional<Question> findById(Long id);
}