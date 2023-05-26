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
    @NonNull
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Question question;

    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    private List<Choice> choices = new ArrayList<>();

    public void fetchChoices(){
        for(Choice choice : question.getChoices()){
            this.choices.add(new Choice(
                choice.getChoiceText(),
                choice.getGrade(),
                choice.getC_imageURL(),
                choice.getChosen()
            ));
        }
    }
    //clone choice
    //constructor includes fetchChoices 

    public float getMark (){
        float result = 0;
        for(Choice choice : this.choices){
            result += choice.getGrade()*choice.getChosen();
        }
        return result;
    };
    //tính toán điểm tung cau
    //so cau đúng,với mark=1; thì point=%X(0,1)
    //questionsinquiz là định dạng question trong 1 quiz làm bài, không phải trong 1 quiz cụ thể
}

