package com.projectoop.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Quiz {
    @NonNull
    private String name;

    private String Description;
    private List<Long> questionsID = new ArrayList<>();
    // use for add, edit, delete and shuffle
    private Date timeOpen;
    private Date timeClose;
    //Khai bao dạng dữ liệu date
    private int timeLimit;
    // countdown???
    private String quizAttemp;
    private String quizState;
    private float quizMaxGrade;
    //if (quizMaxGrade<<quizPoint) {quizMaxGrade=quizPoint;}

    
}
