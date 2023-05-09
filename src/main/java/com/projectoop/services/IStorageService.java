package com.projectoop.services;

import java.util.List;

// import java.util.ArrayList;
// import java.util.stream.Stream;

// import org.hibernate.mapping.List;
import org.springframework.web.multipart.MultipartFile;

import com.projectoop.model.Question;

public interface IStorageService {
    public String storeImageFile(MultipartFile file);

    public String storeTextFile(MultipartFile file);

    public byte[] readFileContent(String fileName);

    public String readQuestionFromFile(String fileContent);

}
