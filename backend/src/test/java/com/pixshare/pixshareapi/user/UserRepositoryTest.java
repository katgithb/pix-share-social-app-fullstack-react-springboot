package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.AbstractTestcontainers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest extends AbstractTestcontainers {

    @Autowired
    private UserRepository userRepository;

    private String username;
    private String name;
    private String email;
    private String password;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        String firstName = FAKER.name().firstName();
        String lastName = FAKER.name().lastName();
        username = firstName.toLowerCase();
        name = firstName + " " + lastName;
        email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        password = "password";
    }

    @Test
    @DisplayName("Should return false when a user with the given email does not exist")
    void existsUserByEmailWhenUserDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";

        // When
        boolean actual = userRepository.existsUserByEmail(email);

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    @DisplayName("Should return true when a user with the given email exists")
    void existsUserByEmailWhenUserExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE);
        userRepository.save(user);

        // When
        boolean actual = userRepository.existsUserByEmail(email);

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    @DisplayName("Should return false when user does not exist by given id")
    void existsUserByIdWhenUserDoesNotExist() {
        // Given
        Long userId = 1L;

        // When
        boolean actual = userRepository.existsUserById(userId);

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    @DisplayName("Should return true when user exists by given id")
    void existsUserByIdWhenUserExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE);
        User savedUser = userRepository.save(user);

        // When
        boolean actual = userRepository.existsUserById(savedUser.getId());

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    @DisplayName("Should return an empty Optional when the email does not exist")
    void findByEmailWhenEmailDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";

        // When
        Optional<User> actualUser = userRepository.findByEmail(email);

        // Then
        assertThat(actualUser.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an Optional containing the user when the email exists")
    void findByEmailWhenEmailExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE);
        userRepository.save(user);

        // When
        Optional<User> actualUser = userRepository.findByEmail(user.getEmail());

        // Then
        assertThat(actualUser.isPresent()).isTrue();
        assertThat(actualUser.get()).isEqualTo(user);
    }

    @Test
    @DisplayName("Should return an empty Optional when the username does not exist")
    void findByUsernameWhenUsernameDoesNotExist() {
        // Given
        String username = "nonexistentuser";

        // When
        Optional<User> actualUser = userRepository.findByUserHandleName(username);

        // Then
        assertThat(actualUser.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an Optional of User when the username exists")
    void findByUsernameWhenUsernameExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE);
        userRepository.save(user);

        // When
        Optional<User> actualUser = userRepository.findByUserHandleName(user.getUserHandleName());

        // Then
        assertThat(actualUser.isPresent()).isTrue();
        assertThat(actualUser.get()).isEqualTo(user);
    }

    @Test
    @DisplayName("Should return an empty list when no user IDs are provided")
    void findAllUsersByUserIdsWithEmptyUserIds() {
        // Given
        List<Long> userIds = List.of();

        // When
        List<User> actualUsers = userRepository.findAllUsersByUserIds(userIds);

        // Then
        assertThat(actualUsers.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an empty list when no users match the given user IDs")
    void findAllUsersByUserIdsWithNonMatchingUserIds() {
        // Given
        List<Long> userIds = List.of(1L, 2L, 3L);

        // When
        List<User> actualUsers = userRepository.findAllUsersByUserIds(userIds);

        // Then
        assertThat(actualUsers.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return all users with the given user IDs")
    void findAllUsersByUserIdsWithValidUserIds() {
        // Given
        User user1 = new User(username + 1, email + 1, password, name + 1, Gender.MALE);
        User user2 = new User(username + 2, email + 2, password, name + 2, Gender.FEMALE);
        User user3 = new User(username + 3, email + 3, password, name + 3, Gender.OTHER);

        List<User> users = List.of(user1, user2, user3);
        userRepository.saveAll(users);
        List<Long> userIds = List.of(user1.getId(), user2.getId());

        // When
        List<User> actualUsers = userRepository.findAllUsersByUserIds(userIds);

        // Then
        assertThat(actualUsers.size()).isEqualTo(2);
        assertThat(actualUsers.contains(user1)).isTrue();
        assertThat(actualUsers.contains(user2)).isTrue();
    }

    @Test
    @DisplayName("Should return an empty list when the query does not match any username or email")
    void findByQueryWhenQueryDoesNotMatchAnyUsernameOrEmail() {
        // Given
        String query = "nonexistent";

        // When
        List<User> actualUsers = userRepository.findByQuery(query);

        // Then
        assertThat(actualUsers.size()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should return a list of users when the query matches their username or email")
    void findByQueryWhenQueryMatchesUsernameOrEmail() {
        // Given
        String query = "john";
        User user1 = new User("johndoe", "johndoe@example.com", password, "John Doe", Gender.MALE);
        User user2 = new User("jane", "jane@example.com", password, "Jane Smith", Gender.FEMALE);
        User user3 = new User("johndoe2", "johndoe2@example.com", password, "John Doe Jr.", Gender.MALE);

        List<User> users = List.of(user1, user2, user3);
        userRepository.saveAll(users);

        // When
        List<User> actualUsers = userRepository.findByQuery(query);

        // Then
        assertThat(actualUsers.size()).isEqualTo(2);
        assertThat(actualUsers.contains(user1)).isTrue();
        assertThat(actualUsers.contains(user3)).isTrue();
    }

}