package com.projectoop.model;

import java.util.ArrayList;
import java.util.List;
// import org.json.simple.JSONObject;

//import com.itextpdf.text.Element;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
<<<<<<< HEAD
@Table(name = "questions")

=======
@Table(name = "questions", schema = "myschema", catalog = "mysql")
>>>>>>> 73b88983f77f38ef7545a3ebee95609ba04d286b
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @NonNull
    private String text;
    private String imageURL;
    private float defaultMark;

<<<<<<< HEAD
    // @ManyToOne(cascade=CascadeType.PERSIST)
    // private Category category;
    private Long categoryID;
=======
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Category category;
>>>>>>> 73b88983f77f38ef7545a3ebee95609ba04d286b

    
    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    //private Map<Float, String> choices = new HashMap<Float, String>();
    private List<Choice> choices = new ArrayList<>();

    // getMark = choices[i].grade*choices[i].chosen
}
