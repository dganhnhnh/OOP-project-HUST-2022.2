package com.projectoop.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@NoArgsConstructor
@Embeddable
@Data
// @Table(name = "choices")
public class Choice {
    @NonNull
    private String choiceText;
    @NonNull
    private float grade;
    private String c_imageURL;

    private boolean chosen;

<<<<<<< HEAD
    public Choice(@Nonnull String choiceText, @NonNull float grade) {
        this.choiceText = choiceText;
        this.grade = grade;
    }
    
    @Override
    public String toString() {
        return "text: " + choiceText + ", grade: " + grade;
    }
=======
>>>>>>> 73b88983f77f38ef7545a3ebee95609ba04d286b
}
