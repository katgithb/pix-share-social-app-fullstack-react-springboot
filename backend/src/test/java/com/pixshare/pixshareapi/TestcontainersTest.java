package com.pixshare.pixshareapi;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


public class TestcontainersTest extends AbstractTestcontainers {

    @Test
    void canStartPostgresDB() {
        assertThat(POSTGRESQL_CONTAINER.isRunning()).isTrue();
        assertThat(POSTGRESQL_CONTAINER.isCreated()).isTrue();
    }
}
