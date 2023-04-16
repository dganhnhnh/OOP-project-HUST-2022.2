package com.projectoop;

import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {
    private final CategoryRepo repository;

    public Initializer(CategoryRepo repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) {
        // TODO: category init only "Default"
        Stream.of("Kien truc may tinh", "OOP", "Ky thuat lap trinh","CSDL")
        .forEach(name ->
            repository.save(new Category(name))
        );
        repository.findAll().forEach(System.out::println);
    }
}