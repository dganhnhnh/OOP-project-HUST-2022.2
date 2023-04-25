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
import java.util.Collection;

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
            Paragraph paragraphC = new Paragraph(question.getChoices().toString(), fontBody);
            document.add(paragraphQ);
            if (question.getImageURL() != null) {
                Image image = Image.getInstance(new URL(question.getImageURL()));
                float scaler = ((document.getPageSize().getWidth() - document.leftMargin()
                        - document.rightMargin()) / image.getWidth()) * 50;
                image.scalePercent(scaler);
                document.add(image);
            }
            document.add(paragraphC);
        }
        document.close();
    }
}
