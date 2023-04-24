package com.projectoop.model;

import java.util.HashMap;
import java.util.Map;
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
    // private String category;

    // @OneToMany
    // private Set<Choice> choices;

    // @NonNull
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Float, String> choices = new HashMap<Float, String>();
    
    // get mark
}
