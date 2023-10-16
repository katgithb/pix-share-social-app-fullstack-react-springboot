package com.pixshare.pixshareapi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserByEmail(String email);

    boolean existsUserByUserHandleName(String username);

    boolean existsUserById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserHandleName(String username);

    @Query("SELECT u FROM User u WHERE u.id IN :users")
    List<User> findAllUsersByUserIds(@Param("users") List<Long> userIds);

    @Query("SELECT DISTINCT u FROM User u WHERE u.userHandleName LIKE %:query% OR u.email LIKE %:query%")
    List<User> findByQuery(@Param("query") String query);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN (SELECT u.id AS ufid, COUNT(*) AS cnt FROM User u INNER JOIN u.follower uf GROUP BY u.id) uf
            ON u.id = uf.ufid
            LEFT JOIN (SELECT s.user.id AS sid, COUNT(*) AS cnt FROM Story s GROUP BY s.user.id) s
            ON u.id = s.sid
            WHERE u.id <> :userId
            ORDER BY (COALESCE(uf.cnt, 0) + COALESCE(s.cnt, 0)) DESC, u.userHandleName
            LIMIT 5
            """)
    List<User> findPopularUsers(@Param("userId") Long userId);
}