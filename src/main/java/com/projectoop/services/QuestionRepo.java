package com.projectoop.services;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectoop.model.Question;

public interface QuestionRepo extends JpaRepository<Question, Long> {
    Question findByName(String name);

    Question findByText(String text);
    // Optional<Question> findById(Long id);

}