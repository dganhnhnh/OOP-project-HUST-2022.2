package com.projectoop.services;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import com.projectoop.model.Choice;
import com.projectoop.model.ImportResult;
import com.projectoop.model.Question;
import com.projectoop.model.ReadDocxFileResult;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.*;

@Service
public class FileStorageService implements IStorageService {

    private final Path storageFolder = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(storageFolder);
        } catch (IOException exception) {
            throw new RuntimeException("Cannot create upload folder");
        }
    }

    private boolean isImageFile(MultipartFile file) {
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        return Arrays.asList(new String[] { "png", "jpg", "jpeg", "bmp", "gif" })
                .contains(fileExtension.trim().toLowerCase());
    }

    private boolean isTextFile(MultipartFile file) {
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        return Arrays.asList(new String[] { "txt", "docx" })
                .contains(fileExtension.trim().toLowerCase());
    }

    private boolean isVideo(MultipartFile file) {
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        return Arrays.asList(new String[] { "mp4" })
                .contains(fileExtension.trim().toLowerCase());
    }

    private String renameFile(MultipartFile file) {

        String fileExtention = FilenameUtils.getExtension(file.getOriginalFilename());
        String generatedFileName = UUID.randomUUID().toString().replace("-", "");
        generatedFileName = generatedFileName + "." + fileExtention;
        Path destinationFilePath = this.storageFolder.resolve(Paths.get(generatedFileName))
                .normalize().toAbsolutePath();
        if (!destinationFilePath.getParent().equals(this.storageFolder.toAbsolutePath())) {
            throw new RuntimeException();
        }
        // copy to destination file path
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception exception) {
            throw new RuntimeException();
        }
        return generatedFileName;

    }

    @Override
    public String storeImageFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot upload file");
            }
            // check file is image?
            if (!isImageFile(file)) {
                throw new RuntimeException("You can upload only image file");
            }
            String imageName = renameFile(file);
            return imageName;
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
            String textName = renameFile(file);
            return textName;
        } catch (Exception exception) {
            throw new RuntimeException();
        }
    }

    @Override
    public String storeVideoFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot upload file");
            }
            if (!isVideo(file)) {
                throw new RuntimeException("You can upload only video file");
            }
            String videoName = renameFile(file);
            return videoName;
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
        } catch (IOException exception) {
            throw new RuntimeException();
        }
    }

    public ReadDocxFileResult readMultimediaFile(String fileName) {
        String fileText = new String();
        boolean[] paragraphHasImage = new boolean[1000];

        try {
            // ByteArrayInputStream inputStream = new
            // ByteArrayInputStream(fileContentBytes);

            Path path = storageFolder.resolve(fileName);
            byte[] byteData = Files.readAllBytes(path);
            ByteArrayInputStream inputStream = new ByteArrayInputStream(byteData);

            XWPFDocument document = new XWPFDocument(inputStream);

            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            // fileText += extractor.getText();
            // fileText += "END OF QUESTION TEXT\n";
            int imgId = 0;

            int pos = 0;

            for (XWPFParagraph paragraph : document.getParagraphs()) {
                boolean check = false;
                // Loop through all runs of the paragraph
                for (XWPFRun run : paragraph.getRuns()) {
                    if (run.getEmbeddedPictures().size() > 0) {
                        // XWPFRun runXwpfRun = paragraph.getRuns().get(pos);
                        // This run contains an image
                        byte[] imageBytes = run.getEmbeddedPictures().get(0).getPictureData().getData();
                        // do something with imageBytes
                        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
                        // Create the image file on the server

                        // image file rename
                        String imgFileName = new String("DocxIm_");
                        imgFileName += fileName + "_img_" + pos + ".png";
                        Path destinationFilePath = this.storageFolder.resolve(Paths.get(imgFileName))
                                .normalize().toAbsolutePath();
                        File imageFile = new File(destinationFilePath.toString());
                        ImageIO.write(image, "png", imageFile);
                        check = true;
                    }
                }
                if (check == true)
                    paragraphHasImage[pos] = true;
                pos++;
            }
            // remove blank line in pos of image
            for (int i = document.getParagraphs().size() - 1; i >= 0; i--) {
                if (paragraphHasImage[i]) {
                    document.removeBodyElement(i);
                }
            }
            fileText += extractor.getText();
            extractor.close();
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        ReadDocxFileResult result = new ReadDocxFileResult(paragraphHasImage, fileText);

        return result;
    }

    @Override
    public ImportResult readQuestionFromFile(String fileContent, String fileName, boolean[] lineHasImage,
            boolean isDocxFile) {
        String pathForFile = "http://localhost:8080/api/File/";
        int imageCount = 0;

        // chạy vòng for cho tất cả các line
        // xảy ra các trường hợp: line dạng A. , ANSWER, dạng null, dạng <questiontext>

        // chuyển nội dung file thành mảng các dòng
        String[] oldlines = new String[300];
        oldlines = fileContent.split("\n");
        String[] lines = Arrays.copyOf(oldlines, oldlines.length + 1);
        lines[oldlines.length] = "\n";
        int linescount = lines.length;
        int linenumber = 0;

        List<Question> questions = new ArrayList<>();
        List<Choice> choices = new ArrayList<>();

        String[] ans = new String[26]; // lưu phương án đúng (A, B ..), có tối đa 26 phương án trong 1 câu hỏi
        String[] anscontent = new String[26]; // lưu nội dung đáp án
        int k = 0; // biến đếm số đáp án

        Question question = new Question();

        for (int i = 0; i < linescount; i++) {
            if (lineHasImage[i] == true)
                imageCount++;

            String nowline = lines[i].trim();
            linenumber++;

            // TH dòng trống
            if (nowline.length() < 2) {

                // Kiểm tra dòng trước dòng trống cần là dòng ANSWER
                boolean checknullline = false;
                for (int j = linenumber - 1; j >= 0; j--) {
                    if (lines[j].trim().length() >= 2) {
                        if (lines[j].trim().matches("^ANSWER:\\s[A-Z]")
                                && lines[j - 1].trim().matches("^[A-Z][.]\\s(?=\\s*\\S).*$")) {
                            checknullline = true;
                            break;
                        } else
                            break;
                    }
                }
                if (checknullline == true)
                    continue;
                else {
                    questions = null;
                    break;
                }
            } else {
                if (nowline.matches("^[A-Z][.]\\s(?=\\s*\\S).*$")) {
                    boolean checkansline = false;
                    int wrongline = 0;
                    if (question.getText() == null) {
                        questions = null;
                        break;
                    }
                    // Dòng sau các đáp án phải là ANSWER
                    for (int j = linenumber; j < linescount; j++) {
                        if (!lines[j].trim().matches("^[A-Z][.]\\s(?=\\s*\\S).*$")) {
                            if (lines[j].trim().matches("^ANSWER:\\s[A-Z]")) {
                                checkansline = true;
                                break;
                            } else {
                                wrongline = j + 1;
                                break;
                            }
                        }
                    }
                    if (checkansline == true) {
                        Choice choice = new Choice(nowline.substring(3), 0.0f);
                        anscontent[k] = choice.getChoiceText();
                        ans[k] = nowline.substring(0, 1);
                        choices.add(choice);
                        k++;
                    } else {
                        linenumber = wrongline;
                        questions = null;
                        break;
                    }

                } else if (nowline.matches("^ANSWER:\\s[A-Z]")) {

                    // Sau ANSWER phải là dòng trống
                    if (lines[linenumber].trim().length() >= 2) {
                        linenumber += 1;
                        questions = null;
                        break;
                    }
                    if (question.getText() == null) {
                        questions = null;
                        break;
                    }
                    String answer = nowline.substring(8, 9);

                    // Tối thiểu 2 đáp án
                    if (k < 2) {
                        questions = null;
                        break;
                    }
                    for (int j = 0; j < k; j++) {
                        if (ans[j].trim().equals(answer.trim()))
                            choices.set(j, new Choice(anscontent[j], 1.0f));
                    }
                    question.setChoices(choices);
                    question.setDefaultMark(1.0f);
                    // Nếu là file docx, setimgURL
                    if (isDocxFile == true) {

                        // System.out.println(imageCount);
                        int imageLine = i - k - 1 + imageCount;
                        // System.out.println(imageLine);
                        if (lineHasImage[imageLine] == true) {
                            question.setImageURL(pathForFile + "Image/DocxIm_" + fileName + "_img_" +
                                    imageLine + ".png");
                        }
                    }
                    questions.add(question);
                    question = new Question();
                    choices = new ArrayList<>();
                    ans = new String[26];
                    anscontent = new String[26];
                    k = 0;
                    continue;
                } else {
                    if (question == null) {
                        questions = null;
                        break;
                    }
                    // Sau câu hỏi phải là đáp án
                    if (!lines[i + 1].trim().matches("^[A-Z][.]\\s(?=\\s*\\S).*$")) {
                        questions = null;
                        break;
                    }
                    question.setText(nowline);
                }
            }
        }
        if (questions == null) {
            ImportResult importResult = new ImportResult(linenumber, questions);
            return importResult;
        } else {
            ImportResult importResult = new ImportResult(-1, questions);
            return importResult;
        }
    }

    @Override
    public void deleteUploadedFile(String fileName) {
        try {
            Path file = storageFolder.resolve(fileName);
            Files.deleteIfExists(file);
        } catch (Exception exception) {
            throw new RuntimeException();
        }
    }

}
