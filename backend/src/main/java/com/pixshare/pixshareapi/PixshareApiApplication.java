package com.pixshare.pixshareapi;

import com.github.javafaker.Faker;
import com.github.javafaker.Name;
import com.pixshare.pixshareapi.user.Gender;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Random;
import java.util.UUID;

@SpringBootApplication
public class PixshareApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PixshareApiApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(UserRepository userRepository) {
        return args -> {
            Faker faker = new Faker();
            Name name = faker.name();

            String firstName = name.firstName();
            String lastName = name.lastName();
            String username = firstName.toLowerCase();
            Random random = new Random();
            Gender gender = (random.nextInt(18, 45) % 2 == 0) ? Gender.MALE : Gender.FEMALE;
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
            String randomPassword = UUID.randomUUID().toString();

            User user = new User(
                    username,
                    email,
                    randomPassword,
                    firstName + " " + lastName,
                    gender
            );

//            userRepository.save(user);
//            System.out.println(email);
        };
    }

}
