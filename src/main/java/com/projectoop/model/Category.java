package com.projectoop.model;

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
    private int IDNumber;

    // @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    // private Set<Int> questionID;

    // @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    // private Set<Event> events;
}
