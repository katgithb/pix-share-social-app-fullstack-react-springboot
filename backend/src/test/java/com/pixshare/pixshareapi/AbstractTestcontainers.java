package com.pixshare.pixshareapi;

import com.github.javafaker.Faker;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@ActiveProfiles("test")
public abstract class AbstractTestcontainers {

    protected static final Faker FAKER = new Faker();

    protected static final PostgreSQLContainer<?> POSTGRESQL_CONTAINER;

    static {
        POSTGRESQL_CONTAINER = new PostgreSQLContainer<>
                (DockerImageName.parse("postgres:15.3-alpine"))
                .withDatabaseName("pixshare_dao_unit_test_db")
                .withUsername("test_user")
                .withPassword("testpassword");

        POSTGRESQL_CONTAINER.start();
    }

    @DynamicPropertySource
    protected static void registerDataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRESQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRESQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRESQL_CONTAINER::getPassword);
    }

}