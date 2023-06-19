package com.pixshare.pixshareapi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserByEmail(String email);

    boolean existsUserById(Long id);

    public Optional<User> findByEmail(String email);

    public Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.id IN :users")
    public List<User> findAllUsersByUserIds(@Param("users") List<Long> userIds);

    @Query("SELECT DISTINCT u FROM User u WHERE u.username LIKE %:query% OR u.email LIKE %:query%")
    public List<User> findByQuery(@Param("query") String query);

    @Query("""
            SELECT u FROM User u WHERE u.id <> :userId
            ORDER BY (SIZE(u.follower) + SIZE(u.stories)) DESC, u.username
            LIMIT 5
            """)
    public List<User> findPopularUsers(@Param("userId") Long userId);
}