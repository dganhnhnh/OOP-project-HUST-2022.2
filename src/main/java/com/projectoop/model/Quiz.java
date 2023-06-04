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

    private int timeLimitDay;
    private LocalDateTime timeOpen;
    private LocalDateTime timeClose;
    //TODO cơ chế check thời gian quiz mở thì gọi trực tiếp bởi controller trước khi tạo attempt
    // nhưng cũng cần method setQuizState để FE biết hiển thị ở preview của quiz

    public void setDefaultTimeClose (){
       
        System.out.println("Before : " + timeOpen.toString());

        timeClose = timeOpen.plusDays(timeLimitDay); 

        System.out.println("After : " + timeClose.toString());
    }

    private List<Long> quizAttemptID = new ArrayList<>();
    private String quizState;
    //chưa xử lý 
    private boolean ongoingAttempt;
    private float quizMaxGrade;
    //quy ước mark, grade là số câu hay số điểm trên thang 10

}
