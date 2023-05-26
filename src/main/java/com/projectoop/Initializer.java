// package com.projectoop;

// import com.projectoop.model.Category;
// import com.projectoop.model.CategoryRepo;
// import com.projectoop.model.Choice;
// import com.projectoop.model.Question;
// import com.projectoop.model.QuestionRepo;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.Set;
// import java.util.stream.Stream;

// @Component
// class Initializer implements CommandLineRunner {
// private final CategoryRepo categoryRepo;
// private final QuestionRepo questionRepo;

// public Initializer(CategoryRepo categoryRepo, QuestionRepo questionRepo) {
// this.categoryRepo = categoryRepo;
// this.questionRepo = questionRepo;
// }

// @Override
// public void run(String... strings) {
// // TODO: category init only "Default"
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
// ques2.setCategory(e);
// a.add(ques2.getId());
// e.setQuestionID(a);
// ques2.setDefaultMark(1);
// questionRepo.save(ques2);
// categoryRepo.save(e);

// Question ques3 = questionRepo.findByText("mot cong ba bang may");
// ques3.setCategory(e);
// a.add(ques3.getId());
// e.setQuestionID(a);
// ques3.setDefaultMark(1);
// List<Choice> choices = new ArrayList<>();
// Choice choice1 = new Choice("hai", 0.0f);
// choices.add(choice1);
// Choice choice2 = new Choice("bon", 0.5f);
// choice2.setC_imageURL("http://localhost:8080/api/File/Image/25ac2a5d4ae345e39c375eec60574ada.jpg");

// choices.add(choice2);
// Choice choice3 = new Choice("4", 0.5f);
// choices.add(choice3);
// ques3.setChoices(choices);
// questionRepo.save(ques3);
// categoryRepo.save(e);

// categoryRepo.findAll().forEach(System.out::println);
// questionRepo.findAll().forEach(System.out::println);
// }
// }