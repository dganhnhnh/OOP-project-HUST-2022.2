package com.projectoop.web;

import java.io.File;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.FilenameUtils;
import org.mp4parser.IsoFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.projectoop.model.ResponseObject;
import com.projectoop.services.IStorageService;

@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = { "Content-Type", "Accept" })
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
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                    new ResponseObject("ok", "you can upload only image/gif file", ""));
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
    }

    // upload video file
    @PostMapping("/uploadVideo")
    public ResponseEntity<?> upLoadVideo(@RequestParam("video") MultipartFile file) {
        try {
            String generatedFileName = storageService.storeVideoFile(file);
            File newfile = new File(System.getProperty("java.io.tmpdir") + "/" +
                    file.getOriginalFilename());
            System.out.println(newfile.getAbsolutePath());
            file.transferTo(newfile);
            IsoFile isoFile = new IsoFile(newfile);
            double actualVideoDurationInSeconds = (double) isoFile.getMovieBox().getMovieHeaderBox().getDuration() /
                    isoFile.getMovieBox().getMovieHeaderBox().getTimescale();
            isoFile.close();
            if (actualVideoDurationInSeconds > 10 || actualVideoDurationInSeconds < 1) {
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                        new ResponseObject("ok", "You can upload only 1-10s video", ""));
            } else {
                return ResponseEntity.status(HttpStatus.OK).body(generatedFileName);
            }
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                    new ResponseObject("ok", "You can upload only video file", ""));
        }
    }

    // get video's url
    @GetMapping("/video/{fileName:.+}")
    public ResponseEntity<Resource> getVideoByName(@PathVariable("fileName") String fileName) {
        byte[] bytes = storageService.readFileContent(fileName);
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(bytes));
    }

    // upload textfile
    @PostMapping("/uploadTextFile")
    public ResponseEntity<?> upLoadTextFile(@RequestParam("text") MultipartFile file) {
        try {
            String generatedTextName = storageService.storeTextFile(file);
            return ResponseEntity.status(HttpStatus.OK).body(generatedTextName);

        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                    new ResponseObject("ok", "You can upload only text file", file));
        }
    }

    @GetMapping("/createQuestion/{fileName:.+}")
    public ResponseEntity<?> creatQuestionFromFile(@PathVariable String fileName) {
        // if text file do this, if docx file do that
        try {
            String reply = new String();
            String fileExtention = FilenameUtils.getExtension(fileName);
            if (fileExtention.equals(new String("txt"))) {
                byte[] fileContent = storageService.readFileContent(fileName);
                String fileText = new String(fileContent, StandardCharsets.UTF_8);
                reply += storageService.readQuestionFromFile(fileText, fileName);
            } else if (fileExtention.equals(new String("docx"))) {

                String fileText = storageService.readMultimediaFile(fileName);
                reply += storageService.readQuestionFromFile(fileText, fileName);
                // hủy comment chỗ này sau khi đã sửa xong readQuestionFromFile
                // reply += fileText;
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