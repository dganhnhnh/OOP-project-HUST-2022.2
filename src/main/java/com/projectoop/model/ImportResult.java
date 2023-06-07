package com.projectoop.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportResult {
    private int quesLine;
    private List<Question> quesList;

    public ImportResult(int quesLine, List<Question> quesList) {
        this.quesLine = quesLine;
        this.quesList = quesList;
    }
}
