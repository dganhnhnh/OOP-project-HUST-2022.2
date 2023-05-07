package com.projectoop.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Date {

    private Timer time;
    // Định nghĩa timer
    private int day;
    private int month;
    private int year;
    
}
