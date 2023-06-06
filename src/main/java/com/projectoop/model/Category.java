package com.projectoop.model;

import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories", schema = "myschema", catalog = "mysql")
public class Category {
    @Id
    @GeneratedValue
    private Long id;

    @NonNull
    private String name;
    private String info;
    
    // @OneToMany(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
    // private Set<Category> subCat;
    @ElementCollection (fetch = FetchType.EAGER)
    private Set<Long> subCatID;
    //change to List? nullable? can be pushed to?

    private Long parentID; 

    @ElementCollection (fetch = FetchType.EAGER)
    private Set<Long> questionID;
}
