package com.projectoop.web;

import com.projectoop.model.Category;
import com.projectoop.model.Question;
import com.projectoop.model.Quiz;
import com.projectoop.model.QuizAttempt;
import com.projectoop.services.CategoryRepo;
import com.projectoop.services.QuestionRepo;
import com.projectoop.services.QuizAttemptRepo;
import com.projectoop.services.QuizRepo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = { "Content-Type", "Accept",
        "Access-Control-Allow-Origin" })
@RestController
@RequestMapping("/api")
class QuizController {

    private final Logger log = LoggerFactory.getLogger(QuizController.class);
    private QuestionRepo questionRepo;
    private QuizRepo quizRepo;
    private QuizAttemptRepo quizAttemptRepo;

    public QuizController(QuizRepo quizRepo, QuestionRepo questionRepo,QuizAttemptRepo quizAttemptRepo) {
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
        this.quizAttemptRepo = quizAttemptRepo;
    }

    @GetMapping("/quizzes")
    Collection<Quiz> quizzes() {
        return quizRepo.findAll();
    }

    @GetMapping("/quiz/{id}")
    ResponseEntity<?> getQuiz(@PathVariable Long id) {
        Optional<Quiz> quizOptional = quizRepo.findById(id);
        Quiz quiz = quizOptional.get();

        if (quiz.isOngoingAttempt()){
            quiz.setQuizState("Ongoing attempt");
        }
        else if(quiz.getTimeClose().isBefore(LocalDateTime.now())){
            quiz.setQuizState("Closed");
        }
        else if(quiz.getTimeOpen().isAfter(LocalDateTime.now())){
            quiz.setQuizState("Upcoming");
        }
        quizRepo.save(quiz);
        
        return quizOptional.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/quiz")
    ResponseEntity<Quiz> createQuiz(@Valid @RequestBody Quiz quiz) throws URISyntaxException {
        log.info("Request to create Quiz: {}", quiz);
        // quiz.setTimeOpen(LocalDateTime.now());
        // quiz.setDefaultTimeClose();
        Quiz result = quizRepo.save(quiz);
        return ResponseEntity.created(new URI("/api/quiz/" + result.getId()))
                .body(result);
    }

    @PutMapping("/quiz/{id}")
    ResponseEntity<Quiz> updateQuiz(@Valid @RequestBody Quiz quiz) {
        log.info("Request to update Quiz: {}", quiz);
        // quiz.setTimeOpen(LocalDateTime.now());
        // quiz.setDefaultTimeClose();
        Quiz result = quizRepo.save(quiz);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        log.info("Request to delete Quiz: {}", id);

        Optional<Quiz> qOptional = quizRepo.findById(id);
        List <Long> attemptIDList = qOptional.orElseThrow().getQuizAttemptID();
        log.info(attemptIDList.toString());
        quizAttemptRepo.deleteAllById(attemptIDList);
        log.info(attemptIDList.toString());

        quizRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}