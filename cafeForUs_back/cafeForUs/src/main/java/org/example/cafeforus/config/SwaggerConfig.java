package org.example.cafeforus.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("khuslenjunii cafe API Documentation")
                .version("1.0")
                .description("카페프로젝트 API 명세서")
        );
    }
}
