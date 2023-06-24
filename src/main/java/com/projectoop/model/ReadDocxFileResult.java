package com.projectoop.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReadDocxFileResult {
    private boolean[] imageCheck;
    private String questext;

    public ReadDocxFileResult(boolean[] imageCheck, String text) {
        this.imageCheck = imageCheck;
        this.questext = text;
    }

}
