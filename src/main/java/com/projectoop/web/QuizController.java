package com.projectoop.web;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;
import com.projectoop.model.Quiz;      
import com.projectoop.model.QuizRepo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = {"Content-Type","Accept"})
@RestController
@RequestMapping("/api")
class QuizController {

    private final Logger log = LoggerFactory.getLogger(QuizController.class);
    private CategoryRepo categoryRepo;
    private QuestionRepo questionRepo;
    private QuizRepo quizRepo;

    public QuizController(QuizRepo quizRepo,QuestionRepo questionRepo) {
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
    }

    @GetMapping("/quizzes")
    Collection<Quiz> quizzes() {
        log.info(quizRepo.toString());
        return quizRepo.findAll();
    }

    @GetMapping("/quiz/{id}")
    ResponseEntity<?> getQuiz(@PathVariable Long id) {
        Optional<Quiz> quiz = quizRepo.findById(id);
        return quiz.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/quiz")
    ResponseEntity<Quiz> createQuiz(@Valid @RequestBody Quiz quiz) throws URISyntaxException {
        log.info("Request to create Quiz: {}", quiz);
        quiz.setDefaultTimeClose();
        Quiz result = quizRepo.save(quiz);
        return ResponseEntity.created(new URI("/api/quiz/" + result.getId()))
                .body(result);
    }

    @PutMapping("/quiz/{id}")
    ResponseEntity<Quiz> updateQuiz(@Valid @RequestBody Quiz quiz) {
        log.info("Request to update Quiz: {}", quiz);
        quiz.setDefaultTimeClose();
        Quiz result = quizRepo.save(quiz);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        log.info("Request to delete Quiz: {}", id);
        quizRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}