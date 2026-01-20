package com.crs.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "Hotel-Login-Service", url = "http://localhost:8080") 
public interface AuthFeignClient {
    @GetMapping("/auth/validate/admin")
    boolean isAdmin(@RequestHeader("Authorization") String token);
}
