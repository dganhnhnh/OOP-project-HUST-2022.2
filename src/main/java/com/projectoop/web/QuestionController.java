package com.projectoop.web;

import com.itextpdf.text.DocumentException;
import com.projectoop.model.Category;
import com.projectoop.model.CategoryRepo;
import com.projectoop.model.PDFGenerator;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
class QuestionController {

    private final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private QuestionRepo questionRepo;
    private CategoryRepo categoryRepo;

    public QuestionController(QuestionRepo questionRepo, CategoryRepo categoryRepo) {
        this.questionRepo = questionRepo;
        this.categoryRepo = categoryRepo;
    }


    @GetMapping("/questions")
    Collection<Question> questions() {

        return questionRepo.findAll();
    }

    //TODO: add parent category vao day can duyet roi duyet 1 lan 
    @GetMapping("/category/{id}/questions")
    Collection<Question> categoryQuestions(@PathVariable Long id,@RequestParam("show_from_subcategory") boolean showFromSub) {
        Optional<Category> cate = categoryRepo.findById(id);
        Category category = cate.orElseThrow();

        Set<Long> qIDSet = category.getQuestionID();

        List<Question> questionList = new ArrayList<Question>() ;

        // chi hien thi tu subCategory lien sau category nay 
        if(showFromSub == true){
            Set<Long> subCatID = category.getSubCatID();
            if (!subCatID.isEmpty() ) {
                List<Long> subCatIDList = new ArrayList<>(subCatID);
                for(int i=0; i<subCatIDList.size(); i++){
                    Optional<Category> subCat = categoryRepo.findById(subCatIDList.get(i));
                    Category subCategory = subCat.orElseThrow();

                    Set<Long> qIDSetFromSubCat = subCategory.getQuestionID();
                    if(!qIDSetFromSubCat.isEmpty()){
                        List<Long> qIDListFromSubCat = new ArrayList<>(qIDSetFromSubCat);
                        for(int j=0;j<qIDListFromSubCat.size(); j++){
                            Optional<Question> a = questionRepo.findById(qIDListFromSubCat.get(j));
                            questionList.add(a.orElseThrow());
                        }
                    }
                }
            }
        }

        if (qIDSet.isEmpty() ) {return questionList;}
        // if not null 
        List<Long> qIDList = new ArrayList<>(qIDSet);
        for(int i=0; i<qIDList.size(); i++){
            Optional<Question> a = questionRepo.findById(qIDList.get(i));
            questionList.add(a.orElseThrow());
        }
        return questionList;
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
        Optional<Category> optionalCat = categoryRepo.findById(ques.getCategoryID());
        Category cat = optionalCat.orElseThrow();
        Set<Long> qIDSet = cat.getQuestionID();
        qIDSet.add(qID);
        cat.setQuestionID(qIDSet);
        categoryRepo.save(cat);        

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

        Optional<Question> question = questionRepo.findById(id);
        Question ques = question.orElseThrow();

        Optional<Category> optionalCat = categoryRepo.findById(ques.getCategoryID());
        
        Category cat = optionalCat.orElseThrow();
        Set<Long> qIDSet = cat.getQuestionID();
        log.info("set of qID: {}", qIDSet);
        qIDSet.remove(id);
        cat.setQuestionID(qIDSet);
        categoryRepo.save(cat);

        questionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // de tam nao chuyen sang quiz
    @GetMapping("/ExportToPDF")
    public void generatePdf(HttpServletResponse response) throws DocumentException, IOException {
        response.setContentType("application/pdf");
        DateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD:HH:MM:SS");
        String currentDateTime = dateFormat.format(new Date());
        String headerkey = "Content-Disposition";
        String headervalue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
        response.setHeader(headerkey, headervalue);

        Collection<Question> questions = questionRepo.findAll();

        PDFGenerator generator = new PDFGenerator(questions);
        generator.generate(response);
    }

}
