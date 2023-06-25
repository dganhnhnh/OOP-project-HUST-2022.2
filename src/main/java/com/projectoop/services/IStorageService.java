package com.projectoop.services;

import org.springframework.web.multipart.MultipartFile;

import com.projectoop.model.ImportResult;
import com.projectoop.model.ReadDocxFileResult;

public interface IStorageService {
    public String storeImageFile(MultipartFile file);

    public String storeTextFile(MultipartFile file);

    public String storeVideoFile(MultipartFile file);

    public void deleteUploadedFile(String fileName);

    public byte[] readFileContent(String fileName);

    public ImportResult readQuestionFromFile(String fileContent, String fileName, boolean[] lineHasImage,
            boolean isDocxFile);

    public ReadDocxFileResult readMultimediaFile(String fileName);

}
