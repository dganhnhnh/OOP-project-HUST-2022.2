package com.projectoop.services;

import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    public String storeImageFile(MultipartFile file);

    public String storeTextFile(MultipartFile file);

    public String storeVideoFile(MultipartFile file);

    // public void deleteUploadedFile(MultipartFile file);

    public byte[] readFileContent(String fileName);

    public String readQuestionFromFile(String fileContent, String fileName);

    public String readMultimediaFile(String fileName);

}
