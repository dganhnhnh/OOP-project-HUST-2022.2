package com.projectoop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;
    private String text;
    private float defaultMark;
    
    @ManyToOne(cascade=CascadeType.PERSIST)
    private Category category;

    // @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    // private Set<Event> events;
    // public 
}
