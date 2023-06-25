package com.pixshare.pixshareapi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserByEmail(String email);

    boolean existsUserById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserHandleName(String username);

    @Query("SELECT u FROM User u WHERE u.id IN :users")
    List<User> findAllUsersByUserIds(@Param("users") List<Long> userIds);

    @Query("SELECT DISTINCT u FROM User u WHERE u.userHandleName LIKE %:query% OR u.email LIKE %:query%")
    List<User> findByQuery(@Param("query") String query);

    @Query("""
            SELECT u FROM User u, Story s
            WHERE u.id <> :userId AND u.id = s.user.id
            GROUP BY u.id
            ORDER BY (SIZE(u.follower) + COUNT(s.user.id)) DESC, u.userHandleName
            LIMIT 5
            """)
    List<User> findPopularUsers(@Param("userId") Long userId);
}