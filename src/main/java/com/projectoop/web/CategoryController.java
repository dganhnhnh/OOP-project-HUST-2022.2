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
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = {"Content-Type","Accept"})
@RestController
@RequestMapping("/api")
class CategoryController {

    private final Logger log = LoggerFactory.getLogger(CategoryController.class);
    private CategoryRepo categoryRepo;
    private QuestionRepo questionRepo;

    public CategoryController(CategoryRepo categoryRepo,QuestionRepo questionRepo) {
        this.categoryRepo = categoryRepo;
        this.questionRepo = questionRepo;
    }

    @GetMapping("/categories")
    Collection<Category> categories() {
        log.info(categoryRepo.toString());
        return categoryRepo.findAll();
    }

    @GetMapping("/category/{id}")
    ResponseEntity<?> getCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepo.findById(id);
        return category.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/category")
    ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) throws URISyntaxException {
        log.info("Request to create Category: {}", category);
        
        Category result = categoryRepo.save(category);
        return ResponseEntity.created(new URI("/api/category/" + result.getId()))
                .body(result);
    }

    @PutMapping("/category/{id}")
    ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category) {
        log.info("Request to update Category: {}", category);
        Category result = categoryRepo.save(category);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        log.info("Request to delete Category: {}", id);

        Optional<Category> cate = categoryRepo.findById(id);
        Category category = cate.orElseThrow();
        
        Set<Long> qIDSet = category.getQuestionID();
        if(!qIDSet.isEmpty()){
            List<Long> qIDList = new ArrayList<Long>(qIDSet);
            for(int i=0; i<qIDList.size(); i++){
                Optional<Question> a = questionRepo.findById(qIDList.get(i));
                Question b = a.orElseThrow();
                b.setCategory(null);
                // questionRepo.deleteById(qIDList.get(i));
            }
        }

        categoryRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}