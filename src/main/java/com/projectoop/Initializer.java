package com.projectoop;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
import com.projectoop.model.Choice;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {
    private final CategoryRepo categoryRepo;
    private final QuestionRepo questionRepo;

    public Initializer(CategoryRepo categoryRepo, QuestionRepo questionRepo) {
        this.categoryRepo = categoryRepo;
        this.questionRepo = questionRepo;
    }

    @Override
    public void run(String... strings) {
        // TODO: category init only "Default"
        Stream.of("Default","Kien truc may tinh", "OOP","CSDL")
        .forEach(name ->
            categoryRepo.save(new Category(name))
        );
        
        Category parentCat = categoryRepo.findByName("OOP");
        Set<Long> subCat = parentCat.getSubCatID();
        Category newCat = new Category("ck-OOP");
        categoryRepo.save(newCat);
        subCat.add(newCat.getId());
        parentCat.setSubCatID(subCat);
        categoryRepo.save(parentCat);

        Stream.of("Question 1","Question 2","Question 3")
        .forEach(text ->
            questionRepo.save(new Question(text))
        );
        
        Question ques1 = questionRepo.findByText("Question 1");
        Category e = categoryRepo.findByName("OOP");
        ques1.setCategory(e);
        Set<Long> a = e.getQuestionID();
        a.add(ques1.getId());
        e.setQuestionID(a);
        ques1.setDefaultMark(1);
        // Choice choice1 = new Choice("Choice 1", 1);
        // Choice choice2 = new Choice("Choice 2", 0);
        // List<Choice> choices = Arrays.asList({choice1, choice2});
        // ques1.setChoices(choices);
        // ques1.setChoice(choice1);
        //bug neu khai bao chung 1 day choices ntn
        questionRepo.save(ques1);
        categoryRepo.save(e);
        
        
        Question ques2 = questionRepo.findByText("Question 2");
        ques2.setCategory(e);
        a.add(ques2.getId());
        e.setQuestionID(a);
        ques2.setDefaultMark(1);
        questionRepo.save(ques2);
        categoryRepo.save(e);

        Question ques3 = questionRepo.findByText("Question 3");
        Category x = categoryRepo.findByName("ck-OOP");
        ques3.setCategory(x);
        Set<Long> xx= new HashSet<>();
        xx.add(ques3.getId());
        x.setQuestionID(xx);
        ques3.setDefaultMark(1);
        questionRepo.save(ques3);
        categoryRepo.save(x);

        categoryRepo.findAll().forEach(System.out::println);
        questionRepo.findAll().forEach(System.out::println);
    }
}