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
@Table(name = "questions")
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @NonNull
    private String text;
    private String imageURL;
    private float defaultMark;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Category category;

    // @NonNull
    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    // private Map<Float, String> choices = new HashMap<Float, String>();
    private List<Choice> choices = new ArrayList<>();
    // private Choice choice = new Choice();

    // getMark = choices[i].grade*choices[i].chosen
}
