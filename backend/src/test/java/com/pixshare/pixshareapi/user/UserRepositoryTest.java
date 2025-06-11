package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.AbstractTestcontainers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest extends AbstractTestcontainers {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    private String username;
    private String name;
    private String email;
    private String password;
    private Role userRole;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        userRole = roleRepository.findByRoleName(RoleName.USER.name())
                .orElseGet(() -> roleRepository.save(Role.of(RoleName.USER)));

        String firstName = FAKER.name().firstName();
        String lastName = FAKER.name().lastName();
        username = "u12345_" + FAKER.name().username();
        name = firstName + " " + lastName;
        email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        password = "password123#";
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
        User user = new User(username, email, password, name, Gender.MALE, userRole);
        userRepository.save(user);

        // When
        boolean actual = userRepository.existsUserByEmail(email);

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    @DisplayName("Should return false when the user with given handle name does not exist")
    void existsUserByUserHandleNameWhenUserDoesNotExist() {
        // Given
        String userHandleName = "nonexistentuser";

        // When
        boolean actual = userRepository.existsUserByUserHandleName(userHandleName);

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    @DisplayName("Should return true when the user with given handle name exists")
    void existsUserByUserHandleNameWhenUserExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE, userRole);
        userRepository.save(user);

        // When
        boolean actual = userRepository.existsUserByUserHandleName(username);

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
        User user = new User(username, email, password, name, Gender.MALE, userRole);
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
        User user = new User(username, email, password, name, Gender.MALE, userRole);
        userRepository.save(user);

        // When
        Optional<User> actualUser = userRepository.findByEmail(user.getEmail());

        // Then
        assertThat(actualUser.isPresent()).isTrue();
        assertThat(actualUser.get()).isEqualTo(user);
    }

    @Test
    @DisplayName("Should return an empty Optional when the username does not exist")
    void findByUserHandleNameWhenUsernameDoesNotExist() {
        // Given
        String username = "nonexistentuser";

        // When
        Optional<User> actualUser = userRepository.findByUserHandleNameAndRole_RoleName(
                username, userRole.getRoleName());

        // Then
        assertThat(actualUser.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an Optional of User when the username exists")
    void findByUserHandleNameWhenUsernameExists() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE, userRole);
        userRepository.save(user);

        // When
        Optional<User> actualUser = userRepository.findByUserHandleNameAndRole_RoleName(
                user.getUserHandleName(), userRole.getRoleName());

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
        List<User> actualUsers = userRepository.findAllUsersByUserIdsAndRole_RoleName(
                userIds, userRole.getRoleName());

        // Then
        assertThat(actualUsers.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an empty list when no users match the given user IDs")
    void findAllUsersByUserIdsWithNonMatchingUserIds() {
        // Given
        List<Long> userIds = List.of(1L, 2L, 3L);

        // When
        List<User> actualUsers = userRepository.findAllUsersByUserIdsAndRole_RoleName(
                userIds, userRole.getRoleName());

        // Then
        assertThat(actualUsers.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return all users with the given user IDs")
    void findAllUsersByUserIdsWithValidUserIds() {
        // Given
        User user1 = new User(username + 1, email + 1, password, name + " one", Gender.MALE, userRole);
        User user2 = new User(username + 2, email + 2, password, name + " two", Gender.FEMALE, userRole);
        User user3 = new User(username + 3, email + 3, password, name + " three", Gender.OTHER, userRole);

        List<User> users = List.of(user1, user2, user3);
        userRepository.saveAll(users);
        List<Long> userIds = List.of(user1.getId(), user2.getId());

        // When
        List<User> actualUsers = userRepository.findAllUsersByUserIdsAndRole_RoleName(
                userIds, userRole.getRoleName());

        // Then
        assertThat(actualUsers.size()).isEqualTo(2);
        assertThat(actualUsers.contains(user1)).isTrue();
        assertThat(actualUsers.contains(user2)).isTrue();
    }

    @Test
    @DisplayName("Should return an empty list when the query does not match any username or email")
    void findByQueryWhenQueryDoesNotMatchAnyUsernameOrEmail() {
        // Given
        Long userId = 1L;
        String query = "nonexistent";

        // When
        Page<User> actualUsersPage = userRepository.findByQueryAndRole_RoleName(
                userId, query, userRole.getRoleName(), PageRequest.of(0, 10));

        // Then
        assertThat(actualUsersPage.getContent().size()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should return a list of users when the query matches their username or email")
    void findByQueryWhenQueryMatchesUsernameOrEmail() {
        // Given
        Long userId = 5L;
        String query = "john";
        User user1 = new User("john_doe", "john.doe@example.com", password, "John Doe", Gender.MALE, userRole);
        User user2 = new User("jane_smith", "jane.smith@example.com", password, "Jane Smith", Gender.FEMALE, userRole);
        User user3 = new User("john_doe2", "john.doe2@example.com", password, "John Doe Jr.", Gender.MALE, userRole);

        List<User> users = List.of(user1, user2, user3);
        userRepository.saveAll(users);

        // When
        Page<User> actualUsersPage = userRepository.findByQueryAndRole_RoleName(
                userId, query, userRole.getRoleName(), PageRequest.of(0, 10));

        // Then
        assertThat(actualUsersPage.getContent().size()).isEqualTo(2);
        assertThat(actualUsersPage.getContent()).contains(user1);
        assertThat(actualUsersPage.getContent()).contains(user3);
    }

    @Test
    @DisplayName("Should return an empty list when no other users exist and the given user id is null")
    void findPopularUsersWhenNoOtherUsersExistAndGivenUserIdIsNull() {
        // Given

        // When
        List<User> actualPopularUsers = userRepository.findPopularUsersByRole_RoleName(
                null, userRole.getRoleName());

        // Then
        assertThat(actualPopularUsers.isEmpty()).isTrue();
    }

    @Test
    @DisplayName("Should return an empty list when no other users exist besides the user with given id")
    void findPopularUsersWhenNoOtherUsersExistAndGivenUserIdIsNotNull() {
        // Given
        Long userId = 1L;

        // When
        List<User> actualPopularUsers = userRepository.findPopularUsersByRole_RoleName(
                userId, userRole.getRoleName());

        // Then
        assertThat(actualPopularUsers.isEmpty()).isTrue();
    }


    @Test
    @DisplayName("Should return a list of popular users without excluding any user when the given user id is null")
    void findPopularUsersWhenGivenUserIdIsNull() {
        // Given
        List<User> expectedPopularUsers = List.of(
                new User(username, email, password, name, Gender.MALE, userRole),
                new User("john_doe", "john.doe@example.com", password, "John Doe", Gender.MALE, userRole),
                new User("jane_smith", "jane.smith@example.com", password, "Jane Smith", Gender.FEMALE, userRole),
                new User("john_doe2", "john.doe2@example.com", password, "John Doe Jr.", Gender.MALE, userRole)
        );

        userRepository.saveAll(expectedPopularUsers);

        // When
        List<User> actualPopularUsers = userRepository.findPopularUsersByRole_RoleName(
                null, userRole.getRoleName());

        // Then
        assertThat(actualPopularUsers.size()).isEqualTo(expectedPopularUsers.size());
        assertThat(actualPopularUsers).containsExactlyInAnyOrderElementsOf(expectedPopularUsers);
    }

    @Test
    @DisplayName("Should return a list of popular users excluding the user with given id when the user exists by given id")
    void findPopularUsersWhenUserExistsByGivenId() {
        // Given
        User user = new User(username, email, password, name, Gender.MALE, userRole);
        List<User> expectedPopularUsers = List.of(
                new User("john_doe", "john.doe@example.com", password, "John Doe", Gender.MALE, userRole),
                new User("jane_smith", "jane.smith@example.com", password, "Jane Smith", Gender.FEMALE, userRole),
                new User("john_doe2", "john.doe2@example.com", password, "John Doe Jr.", Gender.MALE, userRole)
        );

        userRepository.save(user);
        userRepository.saveAll(expectedPopularUsers);

        // When
        List<User> actualPopularUsers = userRepository.findPopularUsersByRole_RoleName(
                user.getId(), userRole.getRoleName());

        // Then
        assertThat(actualPopularUsers.size()).isEqualTo(expectedPopularUsers.size());
        assertThat(actualPopularUsers).containsExactlyInAnyOrderElementsOf(expectedPopularUsers);
        assertThat(actualPopularUsers).doesNotContain(user);
    }

    @Test
    @DisplayName("Should return false when follow user is not followed by the given user")
    void isFollowedByUserWhenNotFollowedByGivenUser() {
        // Given
        User followUser = new User("john_doe", "john.doe@example.com", password, "John Doe", Gender.MALE, userRole);
        User user = new User("jane_smith", "jane.smith@example.com", password, "Jane Smith", Gender.FEMALE, userRole);
        userRepository.save(followUser);
        userRepository.save(user);

        // When
        boolean actual = userRepository.isFollowedByUserAndRole_RoleName(
                followUser.getId(), user.getId(), userRole.getRoleName());

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    @DisplayName("Should return true when follow user is followed by the given user")
    void isFollowedByUserWhenFollowedByGivenUser() {
        // Given
        User followUser = new User("john_doe", "john.doe@example.com", password, "John Doe", Gender.MALE, userRole);
        User user = new User("jane_smith", "jane.smith@example.com", password, "Jane Smith", Gender.FEMALE, userRole);
        followUser.addFollower(user);
        userRepository.save(followUser);
        userRepository.save(user);

        // When
        boolean actual = userRepository.isFollowedByUserAndRole_RoleName(
                followUser.getId(), user.getId(), userRole.getRoleName());

        // Then
        assertThat(actual).isTrue();
    }

}