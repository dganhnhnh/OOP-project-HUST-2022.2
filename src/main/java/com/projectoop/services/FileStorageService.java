package com.projectoop.services;

// import java.io.BufferedReader;
// import java.io.File;
// import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
// import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
// import org.springframework.util.FileCopyUtils;
// import org.springframework.util.ResourceUtils;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import com.projectoop.model.Choice;
import com.projectoop.model.Question;
import com.projectoop.model.QuestionRepo;

import org.apache.commons.io.FilenameUtils;

@Service
public class FileStorageService implements IStorageService {

    @Autowired
    private QuestionRepo questionRepo;

    private final Path storageFolder = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(storageFolder);
        } catch (IOException exception) {
            throw new RuntimeErrorException(null);
        }
    }

    private boolean isImageFile(MultipartFile file) {
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        return Arrays.asList(new String[] { "png", "jpg", "jpeg", "bmp" })
                .contains(fileExtension.trim().toLowerCase());
    }

    private boolean isTextFile(MultipartFile file) {
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        return Arrays.asList(new String[] { "txt", "docx" })
                .contains(fileExtension.trim().toLowerCase());
    }

    @Override
    public String storeImageFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeErrorException(null, "Cannot upload file");
            }
            // check file is image?
            if (!isImageFile(file)) {
                throw new RuntimeErrorException(null, "You can upload only image file");
            }
            // rename file
            String fileExtention = FilenameUtils.getExtension(file.getOriginalFilename());
            String generatedFileName = UUID.randomUUID().toString().replace("-", "");
            generatedFileName = generatedFileName + "." + fileExtention;
            Path destinationFilePath = this.storageFolder.resolve(Paths.get(generatedFileName))
                    .normalize().toAbsolutePath();
            if (!destinationFilePath.getParent().equals(this.storageFolder.toAbsolutePath())) {
                throw new RuntimeErrorException(null);
            }
            // copy to destination file path
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
            }
            return generatedFileName;

        } catch (Exception exception) {
            throw new RuntimeException();
        }

    }

    @Override
    public String storeTextFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot upload file");
            }
            // check file is text file?
            if (!isTextFile(file)) {
                throw new RuntimeException("You can upload only text file");
            }
            // size<=100Mb
            float fileSizeInMegaBytes = file.getSize() / 1_000_000.0f;
            if (fileSizeInMegaBytes > 100.f) {
                throw new RuntimeException("File must be <=100Mb");
            }
            // rename file
            String fileExtention = FilenameUtils.getExtension(file.getOriginalFilename());
            String generatedFileName = UUID.randomUUID().toString().replace("-", "");
            generatedFileName = generatedFileName + "." + fileExtention;
            Path destinationFilePath = this.storageFolder.resolve(Paths.get(generatedFileName))
                    .normalize().toAbsolutePath();

            if (!destinationFilePath.getParent().equals(this.storageFolder.toAbsolutePath())) {
                throw new RuntimeErrorException(null);
            }
            // copy to destination file path
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
            }
            return generatedFileName;
        } catch (Exception exception) {
            throw new RuntimeException();
        }
    }

    @Override
    public byte[] readFileContent(String fileName) {
        try {
            Path file = storageFolder.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                byte[] bytes = StreamUtils.copyToByteArray(resource.getInputStream());
                return bytes;
            } else {
                throw new RuntimeException();
            }
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    @Override
    public String readQuestionFromFile(String fileContent) {

        // chạy vòng for cho tất cả các line
        // xảy ra các trường hợp: line dạng A. , ANSWER, dạng null, dạng <questiontext>

        // chuyển nội dung file thành mảng các dòng
        String[] lines = new String[300];
        lines = fileContent.split("\n");
        int linescount = lines.length;
        int linenumber = 0;

        List<Question> questions = new ArrayList<>();
        List<Choice> choices = new ArrayList<>();

        String[] ans = new String[26]; // lưu phương án đúng (A, B ..), có tối đa 26 phương án trong 1 câu hỏi
        String[] anscontent = new String[26]; // lưu nội dung đáp án
        int k = 0; // biến đếm số đáp án

        Question question = new Question();
        for (int i = 0; i < linescount; i++) {
            String nowline = lines[i].trim();
            linenumber++;

            if (nowline.length() < 2) {
                continue;
            }
            if (nowline.matches("^[A-Z][).]\\s(?=\\s*\\S).*$")) {
                if (question.getText() == null) {
                    questions = null;
                    break; // thêm bị lỗi tại dòng <linenumber>
                }
                Choice choice = new Choice(nowline.substring(3), 0.0f);
                anscontent[k] = choice.getChoiceText();
                ans[k] = nowline.substring(0, 1);
                choices.add(choice);
                k++;
            } else if (nowline.matches("^ANSWER:\\s[A-Z]")) {
                if (question.getText() == null) {
                    question = null;
                    break;
                }
                String answer = nowline.substring(8, 9);
                if (k < 2) {
                    questions = null;
                    break; // thêm báo lỗi
                }
                for (int j = 0; j < k; j++) {
                    if (ans[j].trim().equals(answer.trim()))
                        choices.set(j, new Choice(anscontent[j], 1.0f));
                }
                question.setChoices(choices);
                questions.add(question);
                question = new Question();
                choices = new ArrayList<>();
                ans = new String[1000];
                anscontent = new String[1000];
                k = 0;
                continue;
            } else {
                if (question == null) {
                    questions = null;
                    break;
                }
                question.setText(nowline);
            }
        }
        if (questions == null) {
            return "error at " + linenumber;
        } else {
            questionRepo.saveAll(questions);
            return "Success " + questions.size();
        }
    }

}
