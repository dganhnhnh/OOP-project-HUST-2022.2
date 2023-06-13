package com.projectoop;

import com.projectoop.model.Category;
import com.projectoop.model.Choice;
import com.projectoop.model.Question;
import com.projectoop.model.Quiz;
import com.projectoop.model.QuizAttempt;
import com.projectoop.services.CategoryRepo;
import com.projectoop.services.QuestionRepo;
import com.projectoop.services.QuizAttemptRepo;
import com.projectoop.services.QuizRepo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
class Initializer implements CommandLineRunner {
    private final CategoryRepo categoryRepo;
    private final QuestionRepo questionRepo;
    private final QuizRepo quizRepo;
    private final QuizAttemptRepo quizAttemptRepo;

    public Initializer(CategoryRepo categoryRepo, QuestionRepo questionRepo, QuizRepo quizRepo,
            QuizAttemptRepo quizAttemptRepo) {
        this.categoryRepo = categoryRepo;
        this.questionRepo = questionRepo;
        this.quizRepo = quizRepo;
        this.quizAttemptRepo = quizAttemptRepo;
    }

    @Override
    public void run(String... strings) {

        // Stream.of("Kien truc may tinh", "OOP", "Ky thuat lap trinh", "CSDL")
        // .forEach(name -> categoryRepo.save(new Category(name)));

        // Stream.of("Question 1", "Question 2", "mot cong ba bang may")
        // .forEach(text -> questionRepo.save(new Question(text)));

        // Question question1 = questionRepo.findByText("Question 1");
        // Category e = categoryRepo.findByName("OOP");
        // // tao Question
        // Set<Long> a = e.getQuestionID();
        // Long qID = question1.getId();
        // a.add(qID);
        // e.setQuestionID(a);
        // question1.setDefaultMark(1);
        // question1.setImageURL("http://localhost:8080/api/File/Image/6e3660550e6a482d94dc388a82dcc857.png");
        // question1.setChoices(null);
        // questionRepo.save(question1);
        // categoryRepo.save(e);

        // Question ques2 = questionRepo.findByText("Question 2");
        // ques2.setCategoryID(e.getId());
        // a.add(ques2.getId());
        // e.setQuestionID(a);
        // ques2.setDefaultMark(1);
        // questionRepo.save(ques2);
        // categoryRepo.save(e);

        //  Question ques3 = questionRepo.findByText("Question 3");
        //  Category x = categoryRepo.findByName("ck-OOP");
        //  ques3.setCategoryID(x.getId());
        //  Set<Long> xx= new HashSet<>();
        //  xx.add(ques3.getId());
        //  x.setQuestionID(xx);
        //  ques3.setDefaultMark(1);
        //  questionRepo.save(ques3);
        //  categoryRepo.save(x);
        
        // TO HERE
        
        Quiz newQuiz = new Quiz("Quiz 1");
        newQuiz.setTimeOpen(LocalDateTime.now());
        newQuiz.setDefaultTimeClose();
        quizRepo.save(newQuiz);
        
        categoryRepo.findAll().forEach(System.out::println);
        questionRepo.findAll().forEach(System.out::println);
        quizRepo.findAll().forEach(System.out::println);
        
    }
}