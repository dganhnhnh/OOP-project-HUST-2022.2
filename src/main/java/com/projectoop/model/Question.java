package com.projectoop.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
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

    // @OneToMany
    // private Set<Choice> choices;


    // @NonNull
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Integer, String> choices = new HashMap<Integer, String>();
}
