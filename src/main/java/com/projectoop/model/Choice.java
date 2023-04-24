package com.projectoop.model;

// import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor
@Getter
// @Entity
// @Table(name = "choices")
public class Choice {
    @NonNull
    private String text;
    // private float grade;
}
