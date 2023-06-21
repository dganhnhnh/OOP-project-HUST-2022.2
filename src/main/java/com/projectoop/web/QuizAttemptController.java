package com.projectoop.web;

import com.itextpdf.text.DocumentException;
import com.projectoop.model.Choice;
import com.projectoop.model.PDFGenerator;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionInQuiz;
import com.projectoop.model.Quiz;
import com.projectoop.model.QuizAttempt;
import com.projectoop.services.QuestionRepo;
import com.projectoop.services.QuizAttemptRepo;
import com.projectoop.services.QuizRepo;

import org.apache.tomcat.util.json.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = { "Content-Type", "Accept" })
@RestController
@RequestMapping("/api")
class QuizAttemptController {

    private final Logger log = LoggerFactory.getLogger(QuizController.class);

    private QuestionRepo questionRepo;
    private QuizAttemptRepo quizAttemptRepo;
    private QuizRepo quizRepo;

    public QuizAttemptController(QuizAttemptRepo quizAttemptRepo, QuestionRepo questionRepo, QuizRepo quizRepo) {
        this.quizAttemptRepo = quizAttemptRepo;
        this.questionRepo = questionRepo;
        this.quizRepo = quizRepo;
    }

    @GetMapping("/quiz_attempts")
    Collection<QuizAttempt> quiz_attempts() {
        log.info(quizAttemptRepo.toString());
        return quizAttemptRepo.findAll();
    }

    @GetMapping("/quiz_attempt/{id}")
    ResponseEntity<?> getQuizAttempt(@PathVariable Long id) {
        Optional<QuizAttempt> quizAttempt = quizAttemptRepo.findById(id);
        return quizAttempt.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //TODO: không submit 2 lần 
    @GetMapping("/quiz_attempt/{id}/submit")
    ResponseEntity<?> submitQuizAttempt (@PathVariable Long id) {
        Optional<QuizAttempt> quizAttemptOptional = quizAttemptRepo.findById(id);
        QuizAttempt quizAttempt = quizAttemptOptional.orElseThrow();

        for(QuestionInQuiz quesInQuiz : quizAttempt.getQuesInQuizList()){
            quesInQuiz.calcMark();
        }
        quizAttempt.calcTotalMark();

        quizAttempt.setFinished(true);      // cấm truy cập sửa đổi kể từ đây
        quizAttempt.setTimeComplete(LocalDateTime.now());
        quizAttempt.calcTimeTaken();
        quizAttemptRepo.save(quizAttempt);

        Optional<Quiz> quizOptional = quizRepo.findById(quizAttempt.getQuizID());
        Quiz quiz = quizOptional.orElseThrow();
        quiz.setOngoingAttempt(false);
        quizRepo.save(quiz);

        return quizAttemptOptional.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/quiz_attempt")
    ResponseEntity<?> createQuizAttempt(@Valid @RequestBody QuizAttempt quizAttempt) throws URISyntaxException {
        log.info("Request to create QuizAttempt: {}", quizAttempt);
        
        // Quiz quiz = quizAttempt.getQuiz();
        Optional<Quiz> quizOptional = quizRepo.findById(quizAttempt.getQuizID());
        Quiz quiz = quizOptional.orElseThrow();
        log.info(quiz.toString());

        log.info(quiz.getTimeClose().toString());
        log.info((quiz.getTimeClose().isBefore(LocalDateTime.now()))?"closed":"not closed");

        //xử lí các trường hợp Quiz không mở
        if (quiz.isOngoingAttempt()){
            // return ResponseEntity.ok().body();
            throw new QuizNotOpenException("Another attempt is still going!");
        }
        else if(quiz.getTimeClose().isBefore(LocalDateTime.now())){
            throw new QuizNotOpenException("Quiz is closed!");
        }
        else if(quiz.getTimeOpen().isAfter(LocalDateTime.now())){
            throw new QuizNotOpenException("Quiz is not open yet!");
        }


        quizAttempt.setQuiz(quiz);
        // vì quiz lưu trong DB nên mỗi lần gửi request sửa attempt thì không cần truyền
        // thông tin của quiz nữa

        int id = 1;
        for (Long questionsID : quiz.getQuestionsID()) {
            Optional<Question> questionOptional = questionRepo.findById(questionsID);
            Question questionbyid = questionOptional.orElseThrow();
            // da loc ra duoc question theo id
            // khởi tạo ques in quiz bằng ques ID
            QuestionInQuiz newQInQuiz = new QuestionInQuiz(questionsID);
            // tạo 2 dãy này để tương tác
            List<Integer> choiceChosenList = new ArrayList<>();
            List<Float> choiceGradeList = new ArrayList<>();

            for (Choice choice : questionbyid.getChoices()) {
                choiceChosenList.add(0);
                choiceGradeList.add(choice.getGrade());
            }
            newQInQuiz.setChoiceChosen(choiceChosenList);
            newQInQuiz.setChoiceGrade(choiceGradeList);
            newQInQuiz.setIdInQuiz(id);
            id++;
            quizAttempt.quesInQuizList.add(newQInQuiz);
        }

        quizAttempt.setTimeStart(LocalDateTime.now());
        quizAttempt.setTimeComplete(quizAttempt.getTimeStart().plusMinutes(quiz.getTimeLimit()));

        QuizAttempt  result = quizAttemptRepo.save(quizAttempt);

        quiz.setOngoingAttempt(true);
        List<Long> attemptList = quiz.getQuizAttemptID();
        attemptList.add(quizAttempt.getId());
        quiz.setQuizAttemptID(attemptList);
        quizRepo.save(quiz);

        return ResponseEntity.created(new URI("/api/quiz_attempt/" + result.getId()))
                .body(result);
    }

    // TODO: make id property not writtable
    @PutMapping("/quiz_attempt/{id}")
    ResponseEntity<QuizAttempt> updateQuizAttempt(@PathVariable Long id, @Valid @RequestBody QuizAttempt quizAttempt) {
        log.info("Request to update QuizAttempt: {}", quizAttempt);

        Optional<QuizAttempt> optionalEntity = quizAttemptRepo.findById(id);
        if (!optionalEntity.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        QuizAttempt existingEntity = optionalEntity.get();
        BeanWrapper beanWrapper = new BeanWrapperImpl(existingEntity);

        //TODO if finished == true, return forbidden message ,... 
        //TODO calc mark của ques
        
        // kiểm tra thuộc tính có được nhắc tới trong request thì sẽ không update lại bằng giá trị mặc định là null hay 0, ..
        for (PropertyDescriptor descriptor : beanWrapper.getPropertyDescriptors()) {
            String propertyName = descriptor.getName();
            // log.info(propertyName); //in ra kiểm tra tên thuộc tính

            // log.info("is writable: "+beanWrapper.isWritableProperty(propertyName));
            // log.info("property type: "+descriptor.getPropertyType());

            if (beanWrapper.isWritableProperty(propertyName) 
                && !propertyName.equals("id") 
                && !propertyName.equals("class")
                // && descriptor.getPropertyType() != boolean.class
                ) {

                Object requestValue = new BeanWrapperImpl(quizAttempt).getPropertyValue(propertyName);
                // if (requestValue != null) {
                // log.info("requestValue: "+requestValue.toString());
                // } else{log.info("requestValue null");}
                Object existingValue = beanWrapper.getPropertyValue(propertyName);
                // if (existingValue != null) {
                // log.info("existingValue: "+existingValue.toString());
                // }else{log.info("existingValue null");}

                if (requestValue != null) {
                    beanWrapper.setPropertyValue(propertyName, requestValue);
                } else {
                    beanWrapper.setPropertyValue(propertyName, existingValue);
                }
                // TODO: cách này có vấn đề gì không?
            }
        }
        QuizAttempt updatedEntity = quizAttemptRepo.save(existingEntity);
        return ResponseEntity.ok().body(updatedEntity);
        // update object mới với những trường không đc nhắc tới trong request thì giữ
        // nguyên

        // QuizAttempt result = quizAttemptRepo.save(quizAttempt);
        // return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/quiz_attempt/{id}")
    public ResponseEntity<?> deleteQuizAttempt(@PathVariable Long id) {
        log.info("Request to delete QuizAttempt: {}", id);
        quizAttemptRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/quiz_attempt/{id}/ExportToPDF")
    public void generatePdf(HttpServletResponse response, @RequestParam("password") String password,
            @PathVariable Long id)
            throws DocumentException, IOException {
        try {
            response.setContentType(null);
            DateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD:HH:MM:SS");
            String currentDateTime = dateFormat.format(new Date());
            String headerkey = "Content-Disposition";
            String headervalue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
            response.setHeader(headerkey, headervalue);

            Optional<QuizAttempt> tempQuizAttempt = quizAttemptRepo.findById(id);
            QuizAttempt quizAttempt = tempQuizAttempt.orElseThrow();
            Quiz quiz = quizAttempt.getQuiz();
            List<Long> quesIDList = quiz.getQuestionsID();
            Collection<Question> questions = new ArrayList<>();
            for (Long quesID : quesIDList) {
                Optional<Question> tempQues = questionRepo.findById(quesID);
                Question ques = tempQues.orElseThrow();
                questions.add(ques);
            }
            PDFGenerator generator = new PDFGenerator(questions);
            generator.generatePDFWithPassWord(response, password);
        } catch (Exception e) {
            throw new RuntimeException("Cannot find quiz to export");
        }

    }

}