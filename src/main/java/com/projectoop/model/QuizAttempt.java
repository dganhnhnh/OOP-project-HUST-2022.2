package com.projectoop.model;

import java.time.LocalDateTime;  

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
    @Id
    @GeneratedValue
    private Long id;

    @NonNull
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Quiz quiz;

    // @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    public List<QuestionInQuiz> ques = new ArrayList<>();

    //đã lọc được QuestioninQuiz theo id từ controller
    //quizAttempt là Qinquiz nhưng được lọc theo list quiz id;
    //quizAttempt của các bài quiz khác nhau đang lưu chung với nhau
    //quizAttempt Id tự tạo giá trị
    private float mark;
    private boolean finished;
    private LocalDateTime timeTaken;
    private LocalDateTime timeStart;
    private LocalDateTime timeComplete;
    
}
