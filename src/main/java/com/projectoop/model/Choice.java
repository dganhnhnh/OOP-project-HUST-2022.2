package com.projectoop.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@NoArgsConstructor
@Embeddable
@Getter
// @Table(name = "choices")
public class Choice {
    @Nonnull
    private String choiceText;
    @NonNull
    private float grade;

    private boolean chosen;

    @Override
    public String toString() {
        return "text: " + choiceText + ", grade: " + grade;
    }
}
