package com.projectoop.model;

import java.time.LocalDateTime;  
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "quiz_attempt", schema = "myschema", catalog = "mysql")
public class QuizAttempt {
    @NonNull
    private Quiz quiz;

    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    private List<QuestionInQuiz> ques = new ArrayList<>();

    public void fetchQuestions(){
        for(Long qID : quiz.getQuestionsID()){
            
            this.ques.add(new QuestionInQuiz(
                
            ));
        }
    }

    private float mark;
    private boolean finished;
    private LocalDateTime timeTaken;
    private LocalDateTime timeStart;
    private LocalDateTime timeComplete;
    
}
