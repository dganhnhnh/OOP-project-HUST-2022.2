package com.projectoop.services;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;
// se sua thanh Quizservice

@Service
public class questionService {
   @Autowired
   public QuestionRepo repo;

   public Collection<Question> findAll() {
      return repo.findAll();
   }

   public void save(Question question) {
      repo.save(question);
   }
}
