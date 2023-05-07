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
@Table(name = "quiz", schema = "myschema", catalog = "mysql")
public class Quiz {
    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;

    private String Description;
    private List<Long> questionsID = new ArrayList<>();
    // use for add, edit, delete and shuffle
    private LocalDateTime timeOpen;
    private LocalDateTime timeClose;
    //Khai bao dạng dữ liệu date
    private int timeLimit;
    // countdown???
    private String quizAttemp;
    private String quizState;
    private float quizMaxGrade;
    //if (quizMaxGrade<<quizPoint) {quizMaxGrade=quizPoint;}

}
