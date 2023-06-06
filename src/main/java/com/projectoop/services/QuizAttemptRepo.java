package com.projectoop.services;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectoop.model.QuizAttempt;

public interface QuizAttemptRepo extends JpaRepository<QuizAttempt, Long> {
}