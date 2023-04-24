package com.projectoop.model;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;

public class File {

    public ArrayList<String> readQuestionFromFile(String fileName, BufferedReader bufferedReader) {
        try {
            ArrayList<String> listOfLine = new ArrayList<>();
            bufferedReader = new BufferedReader(new FileReader(fileName));
            String line = bufferedReader.readLine();
            while (line != null) {
                listOfLine.add(line);
                line = bufferedReader.readLine();
            }
            bufferedReader.close();
            return listOfLine;
        } catch (Exception e) {
            return null;
        }
    }

    // public List<Question> creatQuestionFromData(ArrayList<String> listOfLine){
    // String[] lines =new String[listOfLine.size()];
    // lines = listOfLine.toArray(lines);
    // int linenumber = 0;
    // List<Question> questions;
    // Question question = null;
    // char[] endchar;
    // int linenumeber = 0;
    // for (String line: lines) {
    // char[] newlines = line.toCharArray();
    // int linecount = newlines.length;
    // for(int i=0; i<linecount;i++){
    // linenumber++;
    // String nowlines = line.trim();
    // char[] nowline = nowlines.toCharArray();

    // if((nowlines.length()) < 2) {
    // continue;
    // }

    // }

}
