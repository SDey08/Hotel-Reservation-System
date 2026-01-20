package com.crs;

import org.springframework.boot.SpringApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class LoginAndRegistrationApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoginAndRegistrationApplication.class, args);
    }
}
