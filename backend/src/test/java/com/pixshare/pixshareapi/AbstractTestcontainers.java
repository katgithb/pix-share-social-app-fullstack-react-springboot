package com.pixshare.pixshareapi;

import com.github.javafaker.Faker;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@ActiveProfiles("test")
@Testcontainers
public abstract class AbstractTestcontainers {

    protected static final Faker FAKER = new Faker();

    @Container
    protected static final PostgreSQLContainer<?> POSTGRESQL_CONTAINER = new PostgreSQLContainer<>
            ("postgres:15.3-alpine")
            .withDatabaseName("pixshare_dao_unit_test_db")
            .withUsername("test_user")
            .withPassword("testpassword");

    static {
        POSTGRESQL_CONTAINER.start();
    }

    @DynamicPropertySource
    private static void registerDataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRESQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRESQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRESQL_CONTAINER::getPassword);
    }
}