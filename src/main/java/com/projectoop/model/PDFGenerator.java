package com.projectoop.model;

// import com.projectoop.model.Question;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URL;
//import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PDFGenerator {
    private Collection<Question> questions;

    public PDFGenerator(Collection<Question> questions) {
        this.questions = questions;
    }

    public void generate(HttpServletResponse respone) throws IOException, DocumentException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, respone.getOutputStream());
        document.open();

        Font fontTitle = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        fontTitle.setSize(20);

        Font fontBody = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        fontBody.setSize(15);

        Paragraph paragraph = new Paragraph("Quiz", fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraph);

        for (Question question : questions) {

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
