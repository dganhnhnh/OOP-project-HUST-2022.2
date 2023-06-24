package com.projectoop.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Data
public class Choice {
    @NonNull
    private String choiceText;
    @NonNull
    private float grade;
    private String c_imageURL;

    private boolean chosen;
    
    @Override
    public String toString() {
        return "text: " + choiceText + ", grade: " + grade;
    }
}
