package com.projectoop.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.persistence.FetchType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@NoArgsConstructor
@Embeddable
@Data
public class QuestionInQuiz {
    private int idInQuiz;

    @NonNull
    // @ManyToOne(cascade = CascadeType.PERSIST)
    // private Question question;
    private Long questionID;

    // @ElementCollection(fetch = FetchType.EAGER)
    // @Embedded
    // private List<Choice> choices = new ArrayList<>();

    private List<Integer> choiceChosen = new ArrayList<>();
    private List<Float> choiceGrade = new ArrayList<>();
    private float quesMark;

    // public void fetchChoices(){
    //     for(Choice choice : question.getChoices()){
    //         choiceChosen.add(0);
    //         choiceGrade.add(choice.getGrade());
    //     }
    // }

    //TODO gọi đến cái này chỉ sau khi đã nộp bài
    public void calcMark (){
        quesMark = 0;
        for(int i=0; i<choiceGrade.size(); i++){
            quesMark += choiceGrade.get(i)*choiceChosen.get(i);
        }
    };
    //tính toán điểm tung cau
    //so cau đúng,với mark=1; thì point=%X[0,1] (đúng1, sai0)
    //questionsinquiz là định dạng question trong 1 quiz làm bài, không phải trong 1 quiz cụ thể
    //questionInquiz la lưu lựa chọn và điểm từng câu ccho attempt
}

