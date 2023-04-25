package com.projectoop;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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
        Stream.of("Kien truc may tinh", "OOP", "Ky thuat lap trinh", "CSDL")
                .forEach(name -> categoryRepo.save(new Category(name)));

        Stream.of("Question 1", "Question 2")
                .forEach(text -> questionRepo.save(new Question(text)));
        {
            Question ques1 = questionRepo.findByText("Question 1");
            Category e = categoryRepo.findByName("OOP");
            ques1.setCategory(e.getName()); // TODO: co the tao moi Category o giao dien
            // tao Question
            Set<Long> a = e.getQuestionID();
            Long qID = ques1.getId();
            a.add(qID);
            e.setQuestionID(a);
            ques1.setDefaultMark(1);
            ques1.setChoices(null);
            questionRepo.save(ques1);
            categoryRepo.save(e);
        }

        {
            Category parentCat = categoryRepo.findByName("OOP");
            Set<Long> subCat = parentCat.getSubCatID();
            Category newCat = new Category("thi cuoi ki OOP");
            categoryRepo.save(newCat);
            subCat.add(newCat.getId());
            parentCat.setSubCatID(subCat);
            categoryRepo.save(parentCat);
        }

        categoryRepo.findAll().forEach(System.out::println);
        questionRepo.findAll().forEach(System.out::println);
    }
}