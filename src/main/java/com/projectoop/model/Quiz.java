package com.projectoop.model;


import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;  
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "quiz", schema = "myschema", catalog = "mysql")
public class Quiz {
    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;

    private String description;
    private List<Long> questionsID = new ArrayList<>();

    private int timeLimit;      // số phút tương ứng với thời lượng làm bài
    private LocalDateTime timeOpen;
    private LocalDateTime timeClose;
    //TODO cơ chế check thời gian quiz mở thì gọi trực tiếp bởi controller trước khi tạo attempt
    // nhưng cũng cần method setQuizState để FE biết hiển thị ở preview của quiz

    public void setDefaultTimeClose (){
        System.out.println("timeOpen: " + timeOpen.toString());
        timeClose = timeOpen.plusDays(0); 
        System.out.println("timeClose: " + timeClose.toString());
    }

    private List<Long> quizAttemptID = new ArrayList<>();
    private String quizState;
    //chưa xử lý 
    private boolean ongoingAttempt;
    private float quizMaxGrade;
    //quy ước mark, grade là số câu hay số điểm trên thang 10

    private boolean shuffle;
    
    // Add a method to delete a question from the quiz
    public boolean deleteQuestion(Long questionID) {
        boolean isRemoved = questionsID.remove(questionID);
        return isRemoved;
    }

}
