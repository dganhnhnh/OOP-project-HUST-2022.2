package com.projectoop.web;

import java.nio.charset.StandardCharsets;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.projectoop.services.IStorageService;

@Controller
@RequestMapping(path = "/api/File")
public class FileController {
    @Autowired
    private IStorageService storageService;

    // upload image
    @PostMapping("/uploadImage")
    public ResponseEntity<?> upLoadImageFile(@RequestParam("image") MultipartFile file) {
        try {
            String generatedFileName = storageService.storeImageFile(file);
            return ResponseEntity.status(HttpStatus.OK).body(generatedFileName);
            // 6e3660550e6a482d94dc388a82dcc857.png
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
    }

    // get image's url
    @GetMapping("/Image/{fileName:.+}")
    public ResponseEntity<byte[]> readDetailFile(@PathVariable String fileName) {
        try {
            byte[] bytes = storageService.readFileContent(fileName);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(bytes);

        } catch (Exception exception) {
            return ResponseEntity.noContent().build();
        }
        // http://localhost:8080/api/File/Image/6e3660550e6a482d94dc388a82dcc857.png
    }

    // upload textfile
    @PostMapping("/uploadTextFile")
    public ResponseEntity<?> upLoadTextFile(@RequestParam("text") MultipartFile file) {
        try {
            String generatedTextName = storageService.storeTextFile(file);
            return ResponseEntity.status(HttpStatus.OK).body(generatedTextName);

        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
    }

    @GetMapping("/createQuestion/{fileName:.+}")
    public ResponseEntity<?> creatQuestionFromFile(@PathVariable String fileName) {
        // if text file do this, if docx file do that 
        try {
            String reply = new String();
            String fileExtention = FilenameUtils.getExtension(fileName);
            if(fileExtention.equals(new String("txt"))){
                byte[] fileContent = storageService.readFileContent(fileName);
                String fileText = new String(fileContent, StandardCharsets.UTF_8);
                reply += storageService.readQuestionFromFile(fileText);
            }
            else if(fileExtention.equals(new String("docx"))){

                String fileText = storageService.readMultimediaFile(fileName);
                // reply += storageService.readQuestionFromFile(fileText);
                // hủy comment chỗ này sau khi đã sửa xong readQuestionFromFile
                // TODO: đọc file text đến đoạn END OF QUESTION TEXT thì đọc URL ảnh và setImageURL trong Question
                reply += fileText;
            }

            return ResponseEntity.ok().body(reply);
        } catch (Exception e) {
            throw new RuntimeException("Cannot read file");
        }
    }

    @GetMapping("/readDocxFile/{fileName:.+}")
    public ResponseEntity<?> readDocxFile(@PathVariable String fileName) {
        try {
            String reply = storageService.readMultimediaFile(fileName);
            return ResponseEntity.ok().body(reply);
        } catch (Exception e) {
            throw new RuntimeException("Cannot read file");
        }
    }

}