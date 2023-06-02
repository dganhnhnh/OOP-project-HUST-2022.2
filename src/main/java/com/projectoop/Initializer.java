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
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {
    private final CategoryRepo categoryRepo;
    private final QuestionRepo questionRepo;
    private final QuizRepo quizRepo;
    private final QuizAttemptRepo quizAttemptRepo;

    public Initializer(CategoryRepo categoryRepo, QuestionRepo questionRepo, QuizRepo quizRepo, QuizAttemptRepo quizAttemptRepo) {
        this.categoryRepo = categoryRepo;
        this.questionRepo = questionRepo;
        this.quizRepo = quizRepo;
        this.quizAttemptRepo = quizAttemptRepo;
    }

    @Override
    public void run(String... strings) {

        // Stream.of("Kien truc may tinh", "OOP", "Ky thuat lap trinh", "CSDL")
        //         .forEach(name -> categoryRepo.save(new Category(name)));

        // Stream.of("Question 1", "Question 2", "mot cong ba bang may")
        //         .forEach(text -> questionRepo.save(new Question(text)));

        // Question question1 = questionRepo.findByText("Question 1");
        // Category e = categoryRepo.findByName("OOP");
        // // tao Question
        // Set<Long> a = e.getQuestionID();
        // Long qID = question1.getId();
        // a.add(qID);
        // e.setQuestionID(a);
        // question1.setDefaultMark(1);
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

        // Question ques3 = questionRepo.findByText("mot cong ba bang may");
        // ques3.setCategoryID(e.getId());
        // a.add(ques3.getId());
        // e.setQuestionID(a);
        // ques3.setDefaultMark(1);
        // List<Choice> choices = new ArrayList<>();
        // Choice choice1 = new Choice("hai", 0.0f);
        // choices.add(choice1);
        // Choice choice2 = new Choice("bon", 0.5f);
        // choices.add(choice2);
        // Choice choice3 = new Choice("4", 0.5f);
        // choices.add(choice3);
        // ques3.setChoices(choices);
        // questionRepo.save(ques3);
        // categoryRepo.save(e);

        // Quiz newQuiz = new Quiz("Quiz 1");
        // newQuiz.setTimeOpen(LocalDateTime.now());
        // newQuiz.setTimeLimitDay(2);
        // newQuiz.setDefaultTimeClose();
        // quizRepo.save(newQuiz);
        
        // // Optional<Quiz> newQuizOptional  = quizRepo.findById(Long.valueOf(1));
        // // Quiz newQuiz =  newQuizOptional.orElseThrow();
        // // QuizAttempt newQuizAttempt = new QuizAttempt(new Quiz("Quiz x"));
        // // quizAttemptRepo.save(newQuizAttempt);

        // // TO HERE


        categoryRepo.findAll().forEach(System.out::println);
        questionRepo.findAll().forEach(System.out::println);
        quizRepo.findAll().forEach(System.out::println);
        quizAttemptRepo.findAll().forEach(System.out::println);
    }
}