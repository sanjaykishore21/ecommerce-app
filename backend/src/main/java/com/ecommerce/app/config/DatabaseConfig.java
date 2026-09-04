package com.ecommerce.app.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class DatabaseConfig {
    // Allows flexible dynamic cloud datasource failover
}
