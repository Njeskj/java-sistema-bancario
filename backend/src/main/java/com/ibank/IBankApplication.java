package com.ibank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(IBankApplication.class, args);
    }
}
