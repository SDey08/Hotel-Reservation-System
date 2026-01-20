package com.crs;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.crs.feign")
public class ReservationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationServiceApplication.class, args);
    }
}
