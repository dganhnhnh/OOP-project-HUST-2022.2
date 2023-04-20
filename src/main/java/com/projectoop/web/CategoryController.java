package com.projectoop.web;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
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
class CategoryController {

    private final Logger log = LoggerFactory.getLogger(CategoryController.class);
    private CategoryRepo categoryRepo;

    public CategoryController(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @GetMapping("/categories")
    Collection<Category> categories() {
        log.info(categoryRepo.toString());
        return categoryRepo.findAll();
    }

    @GetMapping("/category/{id}")
    ResponseEntity<?> getGroup(@PathVariable Long id) {
        Optional<Category> category = categoryRepo.findById(id);
        return category.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    // @GetMapping("/category/{name}")
    // ResponseEntity<?> getGroup(@PathVariable String name) {
    //     Category category = categoryRepo.findByName(name);
    //     return category.map(response -> ResponseEntity.ok().body(response))
    //             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    // }

    @PostMapping("/category")
    ResponseEntity<Category> createGroup(@Valid @RequestBody Category category) throws URISyntaxException {
        log.info("Request to create group: {}", category);
        Category result = categoryRepo.save(category);
        return ResponseEntity.created(new URI("/api/category/" + result.getId()))
                .body(result);
    }

    @PutMapping("/category/{id}")
    ResponseEntity<Category> updateGroup(@Valid @RequestBody Category category) {
        log.info("Request to update group: {}", category);
        Category result = categoryRepo.save(category);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        log.info("Request to delete group: {}", id);
        categoryRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}