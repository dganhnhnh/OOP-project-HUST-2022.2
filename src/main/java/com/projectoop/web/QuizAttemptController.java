package com.projectoop.web;

import com.projectoop.model.Question;
import com.projectoop.model.QuestionInQuiz;
import com.projectoop.model.Quiz;
import com.projectoop.model.QuizAttempt;
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
import java.util.Collection;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = {"Content-Type","Accept"})
@RestController
@RequestMapping("/api")
class QuizAttemptController {

    private final Logger log = LoggerFactory.getLogger(QuizController.class);
   
    private QuestionRepo questionRepo;
    private QuizAttemptRepo quizAttemptRepo;
    private QuizRepo quizRepo;

    public QuizAttemptController(QuizAttemptRepo quizAttemptRepo,QuestionRepo questionRepo,QuizRepo quizRepo) {
        this.quizAttemptRepo = quizAttemptRepo;
        this.questionRepo = questionRepo;
        this.quizRepo = quizRepo;
    }

    @GetMapping("/quiz_attempts")
    String quiz_attempts() {
        log.info(quizAttemptRepo.toString());
        // return quizAttemptRepo.findAll();
        return quizAttemptRepo.findAll().toString();
    }

    @GetMapping("/quiz_attempt/{id}")
    ResponseEntity<?> getQuizAttempt (@PathVariable Long id) {
        Optional<QuizAttempt> quizAttempt = quizAttemptRepo.findById(id);
        return quizAttempt.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/quiz_attempt")
    ResponseEntity<QuizAttempt> createQuiz(@Valid @RequestBody QuizAttempt quizAttempt) throws URISyntaxException {
        log.info("Request to create Quiz: {}", quizAttempt);
        
        // Quiz quiz = quizAttempt.getQuiz();
        Optional<Quiz> quizOptional = quizRepo.findById(quizAttempt.getQuizID());
        Quiz quiz = quizOptional.orElseThrow();
        log.info(quiz.toString());
        quizAttempt.setQuiz(quiz);

        for(Long questionsID : quiz.getQuestionsID()){
            Optional<Question> questionOptional = questionRepo.findById(questionsID); 
            Question questionbyid = questionOptional.orElseThrow();
            //da loc ra duoc question theo id
            quizAttempt.quesInQuizList.add(new QuestionInQuiz(questionbyid)); 
        }
        QuizAttempt  result = quizAttemptRepo.save(quizAttempt);
        return ResponseEntity.created(new URI("/api/quiz_attempt/" + result.getId()))
                .body(result);
    }

    @PutMapping("/quiz_attempt/{id}")
    ResponseEntity<QuizAttempt> updateQuizAttempt(@Valid @RequestBody QuizAttempt quizAttempt) {
        log.info("Request to update QuizAttempt: {}", quizAttempt);
        QuizAttempt result = quizAttemptRepo.save(quizAttempt);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/quiz_attempt/{id}")
    public ResponseEntity<?> deleteQuizAttempt (@PathVariable Long id) {
        log.info("Request to delete QuizAttempt: {}", id);
        quizAttemptRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}