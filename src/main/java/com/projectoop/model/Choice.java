package com.projectoop.model;

import jakarta.persistence.Embeddable;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@NoArgsConstructor
@Embeddable 
// @Table(name = "choices")
public class Choice {
    @NonNull
    private String text;
    @NonNull
    private float grade;

    private boolean chosen;
}
