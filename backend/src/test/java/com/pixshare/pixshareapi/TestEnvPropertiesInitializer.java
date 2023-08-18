package com.pixshare.pixshareapi;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class TestEnvPropertiesInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        MutablePropertySources sources = environment.getPropertySources();

        // Try loading properties from .env file
        String envFilePath = getAbsolutePath("../.env");
        Dotenv dotenv = Dotenv.configure().directory(envFilePath).ignoreIfMissing().ignoreIfMalformed().load();
        Properties dotenvProps = new Properties();
        dotenv.entries().forEach(entry -> dotenvProps.setProperty(entry.getKey(), entry.getValue()));

        if (!dotenvProps.isEmpty()) {
            sources.addFirst(new PropertiesPropertySource("dotenv", dotenvProps));
        }
    }

    private String getAbsolutePath(String relativePath) {
        Path currentPath = Paths.get("").toAbsolutePath();
        Path absolutePath = currentPath.resolve(relativePath);
        return absolutePath.toString();
    }
}
