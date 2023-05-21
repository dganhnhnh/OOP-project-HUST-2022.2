package com.projectoop.model;

import java.util.Timer;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Date {
    private Timer time;
    // Định nghĩa timer
    private int day;
    private int month;
    private int year;
}
