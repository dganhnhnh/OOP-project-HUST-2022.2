package com.projectoop.services;

import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

public class QuizTimer {
    private final Logger log = LoggerFactory.getLogger(QuizTimer.class);

    private Timer timer;
    private int durationInSeconds;
    private RestTemplate restTemplate;
    private Long attemptID;

    public QuizTimer(int durationInSeconds, Long attemptID) {
        timer = new Timer();
        this.durationInSeconds = durationInSeconds;
        this.attemptID = attemptID;
        restTemplate = new RestTemplate();
        // timer.schedule(new SubmitTask(), durationInSeconds * 1000); // Schedule the SubmitTask to run after the specified duration
    }

    class SubmitTask extends TimerTask {
        public void run() {
            // Call the /submit API endpoint to submit the quiz
            String url = "http://localhost:8080/api/quiz_attempt/"+attemptID+"/submit"; // Replace with your API endpoint URL
            log.info(restTemplate.getForObject(url, String.class));
        }
    }

    // Other methods for starting and stopping the timer
    public void start() {
        timer.schedule(new SubmitTask(), durationInSeconds * 1000);
    }

    public void stop() {
        timer.cancel();
        // if submitted by hand, cancel timer
    }

}

