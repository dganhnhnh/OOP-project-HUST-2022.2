package com.projectoop.model;

import java.util.Set;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

// NOTE giong nhu question list 

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue
    private Long id;

    // private Category parent;
    @NonNull
    private String name;
    
    private String info;
    
    @ElementCollection (fetch = FetchType.EAGER)
    private Set<String> questionID;
    // private int[] questionID;

    // @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    // private Set<Int> questionID;

    // @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    // private Set<Event> events;
}
