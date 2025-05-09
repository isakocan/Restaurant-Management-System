package com.rms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Restaurant Management System için ana uygulama sınıfı.
 * Spring Boot uygulamasını başlatır ve CORS (Cross-Origin Resource Sharing) yapılandırması sağlar.
 */
@SpringBootApplication
public class RestaurantManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurantManagementSystemApplication.class, args);
    }
    
    /**
     * CORS yapılandırması - Frontend ve backend arasındaki cross-origin isteklerine izin verir.
     * Bu, frontend'in farklı bir domain'den (örn. GitHub Pages) backend API'ye erişmesine olanak tanır.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization");
            }
        };
    }
}