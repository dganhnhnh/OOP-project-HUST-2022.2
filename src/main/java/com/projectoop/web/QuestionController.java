package com.projectoop.web;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
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
import java.util.Set;

// @CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
class QuestionController {

    private final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private QuestionRepo questionRepo;
    private CategoryRepo categoryRepo;

    public QuestionController(QuestionRepo questionRepo,CategoryRepo categoryRepo) {
        this.questionRepo = questionRepo;
        this.categoryRepo = categoryRepo;
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

        
            Long qID = ques.getId();
            log.info("categoryRepo: {}", categoryRepo.toString());
            Category cat = categoryRepo.findByName(ques.getCategory());
                log.info("category of ques:{}",ques.getCategory());
                log.info("category: {}", cat.toString());
            Set<Long> qIDSet = cat.getQuestionID();
                log.info("set of qID: {}", qIDSet);
            qIDSet.add(qID);
            cat.setQuestionID(qIDSet);
                log.info("set of qID: {}", cat.getQuestionID());
        

        return ResponseEntity.created(new URI("/api/question/" + result.getId()))
                .body(result);
    }

    @PutMapping("/question/{id}")
    ResponseEntity<Question> updateQuestion(@Valid @RequestBody Question ques) {
        log.info("Request to update Question: {}", ques);
        Question result = questionRepo.save(ques);

        {
        Long qID = ques.getId();
        log.info("categoryRepo: {}", categoryRepo.toString());
        Category cat = categoryRepo.findByName(ques.getCategory());
            log.info("category of ques:{}",ques.getCategory());
            log.info("category: {}", cat.toString());
        Set<Long> qIDSet = cat.getQuestionID();
            log.info("set of qID: {}", qIDSet);
        qIDSet.add(qID);
        cat.setQuestionID(qIDSet);
            log.info("set of qID: {}", qIDSet);
        }

        return ResponseEntity.ok().body(result);
        
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        log.info("Request to delete Question: {}", id);
        questionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}