package com.projectoop.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepo extends JpaRepository<Quiz, Long> {
         
    List<Question> findQuestionsForQuiz(Quiz quiz);
    
}