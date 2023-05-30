package com.projectoop.model;

import java.util.ArrayList;
import java.util.List;
// import org.json.simple.JSONObject;

//import com.itextpdf.text.Element;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "questions", schema = "myschema", catalog = "mysql")
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @NonNull
    private String text;
    private String imageURL;
    private float defaultMark;

    private Long categoryID;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Embedded
    //private Map<Float, String> choices = new HashMap<Float, String>();
    private List<Choice> choices = new ArrayList<>();

    // getMark = choices[i].grade*choices[i].chosen
}
