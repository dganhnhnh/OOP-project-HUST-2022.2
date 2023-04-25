package com.projectoop.model;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Collection;
//import java.util.List;

public class PDFGenerator {
    private Collection<Question> questions;

    public PDFGenerator(Collection<Question> questions) {
        this.questions = questions;
    }

    public void generate(HttpServletResponse respone) throws IOException, DocumentException {
        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, respone.getOutputStream());
        document.open();
        // setting font style and size
        Font fontTiltle = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        fontTiltle.setSize(20);
        Font fontBody = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        fontBody.setSize(15);
        // create Paragrap
        Paragraph paragraph = new Paragraph("Questions in Quiz", fontTiltle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraph);

        for (Question question : questions) {
            Paragraph paragraphQ = new Paragraph(question.getText(), fontBody);
            Paragraph paragraphC = new Paragraph(question.getChoices().toString(), fontBody);

            // add question image
            // Image image1 = Image.getInstance(question.getImage());
            // paragraph.add(image1);

            document.add(paragraphQ);
            document.add(paragraphC);
        }
        document.close();
    }

}
