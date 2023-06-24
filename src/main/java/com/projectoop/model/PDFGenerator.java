package com.projectoop.model;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
// import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URL;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.text.StringEscapeUtils;

public class PDFGenerator {
    private Collection<Question> questions;

    public PDFGenerator(Collection<Question> questions) {
        this.questions = questions;
    }

    public void generatePDFWithPassWord(HttpServletResponse respone, String password)
            throws IOException, DocumentException {

        // Xóa nếu test xong
        // String input = "<>nội dung của câu hỏi ở đây</p>\n<p><
        // src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&amp;usqp=CAU\"
        // alt=\"TinyPNG &ndash; Compress WebP, PNG and JPEG images intelligently\"
        // width=\"318\" height=\"159\"></p>";
        // Pattern pattern = Pattern.compile("<p>(.*?)</p>");
        // Matcher matcher = pattern.matcher(input);
        // while (matcher.find()) {
        // String textBetweenTags = matcher.group(1);
        // System.out.println(textBetweenTags);
        // }
        // String encodedText = "H&ocirc;m nay l&agrave; thứ mấy";
        // String decodedText = StringEscapeUtils.unescapeHtml4(encodedText);
        // System.out.println(decodedText);
        // Đến đây

        Document document = new Document(PageSize.A4);

        // Set password
        PdfWriter writer = PdfWriter.getInstance(document, respone.getOutputStream());
        writer.setEncryption(password.getBytes(), password.getBytes(),
                PdfWriter.ALLOW_PRINTING, PdfWriter.ENCRYPTION_AES_128
                        | PdfWriter.DO_NOT_ENCRYPT_METADATA);
        document.open();

        // Tạo font hỗ trợ tiếng việt
        BaseFont bf = BaseFont.createFont(
                "src\\main\\resources\\SVN-Times New Roman.ttf",
                BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font fontTitle = new Font(bf, 20, 1);
        Font fontBody = new Font(bf, 15);

        Paragraph paragraph = new Paragraph("Quiz", fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraph);

        for (Question question : questions) {
            String questext = question.getText();

            // Trường hợp chỉ có text không ảnh
            if (questext.matches("<p>(.*?)</p>")) {
                int start = questext.indexOf("<p>") + 3; // add 3 to skip past the <p> tag
                int end = questext.indexOf("</p>");
                String extractedText = questext.substring(start, end);
                question.setText(StringEscapeUtils.unescapeHtml4(extractedText));
            }
            // Trường hợp có text và ảnh
            else if (questext.matches("<p>(.*?)</p>\n<p>(.*?)</p>")) {
                int textStart = questext.indexOf("<p>", 0) + 3;
                int textEnd = questext.indexOf("</p>", 0);
                String extractedText = questext.substring(textStart, textEnd);
                question.setText(StringEscapeUtils.unescapeHtml4(extractedText));

                int urlStart = questext.indexOf("<img src=\"") + 10;
                int urlEnd = questext.indexOf("\" alt");
                String imgURL = questext.substring(urlStart, urlEnd);
                question.setImageURL(imgURL);
            }
            // Trong trường hợp câu hỏi được import từ file word (chứa ảnh)
            else if (questext.matches("(.*?)<p>(.*?)</p>")) {
                int textEnd = questext.indexOf("<p>");
                String extractedText = questext.substring(0, textEnd);
                question.setText(StringEscapeUtils.unescapeHtml4(extractedText));
            }

            Paragraph paragraphQ = new Paragraph(question.getText(), fontBody);
            List<Choice> q_choices = question.getChoices();
            int choiceCount = q_choices.size();
            String[] rightans = new String[choiceCount];
            Image[] image_ans = new Image[choiceCount];
            int choiceNumber = 0;

            document.add(paragraphQ);
            if (question.getImageURL() != null
                    && !question.getImageURL().substring(question.getImageURL().length() - 3).equals("mp4")) {
                Image image = Image.getInstance(new URL(question.getImageURL()));
                float scaler = ((document.getPageSize().getWidth() - document.leftMargin()
                        - document.rightMargin()) / image.getWidth()) * 50;
                image.scalePercent(scaler);
                document.add(image);
            }
            for (Choice choice : q_choices) {

                String choiceText = choice.getChoiceText();

                // Choice chỉ có text
                if (choiceText.matches("<p>(.*?)</p>")) {
                    int choicestart = choiceText.indexOf("<p>") + 3;
                    int choiceend = choiceText.indexOf("</p>");
                    String extractedChoiceText = choiceText.substring(choicestart, choiceend);
                    choice.setChoiceText(StringEscapeUtils.unescapeHtml4(extractedChoiceText));
                }
                // Choice có cả ảnh và text
                else if (choiceText.matches("<p>(.*?)</p>\n<p>(.*?)</p>")) {
                    int textStart = choiceText.indexOf("<p>", 0) + 3;
                    int textEnd = choiceText.indexOf("</p>", 0);
                    String extractedText = choiceText.substring(textStart, textEnd);
                    choice.setChoiceText(StringEscapeUtils.unescapeHtml4(extractedText));

                    int urlStart = choiceText.indexOf("<img src=\"") + 10;
                    int urlEnd = choiceText.indexOf("\" alt");
                    String imgURL = choiceText.substring(urlStart, urlEnd);
                    choice.setC_imageURL(imgURL);
                }

                Paragraph paragraphC = new Paragraph(choice.getChoiceText(), fontBody);
                document.add(paragraphC);
                if (choice.getC_imageURL() != null
                        && !choice.getC_imageURL().substring(choice.getC_imageURL().length() - 3).equals("mp4")) {
                    Image c_image = Image.getInstance(new URL(choice.getC_imageURL()));
                    float scaler = ((document.getPageSize().getWidth() - document.leftMargin()
                            - document.rightMargin()) / c_image.getWidth()) * 25;
                    c_image.scalePercent(scaler);
                    document.add(c_image);
                    if (choice.getGrade() != 0) {
                        rightans[choiceNumber] = choice.getChoiceText();
                        image_ans[choiceNumber] = c_image;
                        choiceNumber++;
                    }
                } else {
                    if (choice.getGrade() != 0) {
                        rightans[choiceNumber] = choice.getChoiceText();
                        choiceNumber++;
                    }
                }
            }
            for (int k = 0; k < choiceNumber; k++) {
                if (k != 0) {
                    document.add(new Paragraph(rightans[k], fontBody));
                    if (image_ans[k] != null)
                        document.add(image_ans[k]);
                } else {
                    document.add(new Paragraph("ANSWER: ".concat(rightans[0]), fontBody));
                    if (image_ans[0] != null)
                        document.add(image_ans[k]);
                }
            }
        }
        document.close();

    }
}
