package com.projectoop.services;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectoop.model.Quiz;

public interface QuizRepo extends JpaRepository<Quiz, Long> {
         
    // List<Question> findQuestionsForQuiz(Quiz quiz);
}