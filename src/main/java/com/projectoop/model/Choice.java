package com.projectoop.model;

import jakarta.annotation.Nonnull;
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
    @Nonnull
    private String choiceText;
    @NonNull
    private float grade;
    private String c_imageURL;

    private boolean chosen;

}
