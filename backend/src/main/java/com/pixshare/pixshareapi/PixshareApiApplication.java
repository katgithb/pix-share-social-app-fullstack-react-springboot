package com.pixshare.pixshareapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PixshareApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PixshareApiApplication.class, args);
    }

//    @Bean
//    CommandLineRunner runner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//        return args -> {
//            Faker faker = new Faker();
//            Name name = faker.name();
//
//            String firstName = name.firstName();
//            String lastName = name.lastName();
//            String username = firstName.toLowerCase();
//            Random random = new Random();
//            Gender gender = (random.nextInt(18, 45) % 2 == 0) ? Gender.MALE : Gender.FEMALE;
//            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
//            // String randomPassword = UUID.randomUUID().toString();
//            String encodedPassword = passwordEncoder.encode("password");
//
//            User user = new User(
//                    username,
//                    email,
//                    encodedPassword,
//                    firstName + " " + lastName,
//                    gender
//            );
//
//            userRepository.save(user);
//        };
//    }

}
