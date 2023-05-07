package com.projectoop.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepo extends JpaRepository<Quiz, Long> {
         
    // List<Question> findQuestionsForQuiz(Quiz quiz);
}