package com.example.saja_saja.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        String jwtSchemeName = "JWT";

        SecurityScheme securityScheme = new SecurityScheme()
                .name("Authorization")                  // 헤더 이름
                .type(SecurityScheme.Type.HTTP)         // HTTP 인증 타입
                .scheme("bearer")                       // Bearer 토큰
                .bearerFormat("JWT")                    // JWT라고 힌트주기
                .in(SecurityScheme.In.HEADER);          // Authorization 헤더에 넣기

        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList(jwtSchemeName);

        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(jwtSchemeName, securityScheme))
                .addSecurityItem(securityRequirement)
                .info(new Info()
                        .title("API Test")
                        .description("Let's practice Swagger UI")
                        .version("1.0.0"));
    }
}
