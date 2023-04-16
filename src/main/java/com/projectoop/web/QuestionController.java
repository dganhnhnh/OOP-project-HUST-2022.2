package com.projectoop.web;

import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;
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

// @CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
class QuestionController {

    private final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private QuestionRepo questionRepo;

    public QuestionController(QuestionRepo questionRepo) {
        this.questionRepo = questionRepo;
    }

    @GetMapping("/questions")
    Collection<Question> categories() {
        return questionRepo.findAll();
    }

    @GetMapping("/question/{id}")
    ResponseEntity<?> getQuestion(@PathVariable Long id) {
        Optional<Question> Question = questionRepo.findById(id);
        return Question.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/question")
    ResponseEntity<Question> createQuestion(@Valid @RequestBody Question ques) throws URISyntaxException {
        log.info("Request to create Question: {}", ques);
        Question result = questionRepo.save(ques);
        return ResponseEntity.created(new URI("/api/question/" + result.getId()))
                .body(result);
    }

    @PutMapping("/question/{id}")
    ResponseEntity<Question> updateQuestion(@Valid @RequestBody Question ques) {
        log.info("Request to update Question: {}", ques);
        Question result = questionRepo.save(ques);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        log.info("Request to delete Question: {}", id);
        questionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}