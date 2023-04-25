package com.projectoop.services;

// import java.util.ArrayList;
// import java.util.stream.Stream;

// import org.hibernate.mapping.List;
import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    public String storeImageFile(MultipartFile file);

    public String storeTextFile(MultipartFile file);

    public byte[] readImageContent(String fileName);

}
