package com.projectoop.model;

import java.time.LocalDateTime;  
import java.time.Duration;

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

    @ManyToOne(cascade = CascadeType.REFRESH) // thay đổi param này để request không cần truyền nó vào vẫn có nó 
    private Quiz quiz;
    //có cần quiz không khi quiz chỉ liên quan tới quesID đã được lọc ra từ controller và thành ques???


    @NonNull
    private Long quizID;

    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    public List<QuestionInQuiz> quesInQuizList = new ArrayList<>();

    //đã lọc được QuestioninQuiz theo id từ controller
    //ques là QuestionInquiz nhưng được lọc theo list quiz id;
    //Trong Attempt cho hiển thị ra thông tin câu hỏi từ QuestionInQuiz luôn  
    //quizAttempt của các bài quiz khác nhau đang lưu chung với nhau???
    //quizAttempt Id tự tạo giá trị???
    private float totalMark;
    private boolean finished;
    private LocalDateTime timeTaken;
    private LocalDateTime timeStart;
    private LocalDateTime timeComplete;
    // Time ở đây chỉ thời gian làm bài(gồm ngày giờ nhưng timetaken chỉ hiện phút giây )
    public void calcTimeTaken (){
       
        Duration timeTaken = Duration.between(timeStart, timeComplete);
        // long seconds = timeTaken.getSeconds();
    }
    
    public void calcTotalMark() {
        for(QuestionInQuiz questionInQuiz : this.quesInQuizList){
            totalMark += questionInQuiz.getQuesMark();
        }
    }
    // gọi đến cái này sau khi nộp bài
    
}
