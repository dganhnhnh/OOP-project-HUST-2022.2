package com.projectoop.model;

import java.util.ArrayList;
import java.util.List;
// import org.json.simple.JSONObject;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @NonNull
    private String text;
    private float defaultMark;
    

    @ManyToOne(cascade=CascadeType.PERSIST)
    private Category category;

    
    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    // private Map<Float, String> choices = new HashMap<Float, String>();
    private List<Choice> choices = new ArrayList<>();
    // private Choice choice = new Choice();

    // getMark = choices[i].grade*choices[i].chosen
}
