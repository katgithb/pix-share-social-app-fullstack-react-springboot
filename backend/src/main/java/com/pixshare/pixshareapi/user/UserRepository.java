package com.pixshare.pixshareapi.user;

import jakarta.annotation.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT DISTINCT u FROM User u WHERE (u.userHandleName LIKE %:query% OR LOWER(u.name) LIKE %:query% OR u.email LIKE %:query%) AND u.id <> :userId")
    Page<User> findByQuery(@Param("userId") Long userId, @Param("query") String query, Pageable pageable);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN u.follower f ON f.id = :userId
            LEFT JOIN (SELECT u.id AS ufid, COUNT(*) AS cnt FROM User u INNER JOIN u.follower uf GROUP BY u.id) uf
            ON u.id = uf.ufid
            LEFT JOIN (SELECT s.user.id AS sid, COUNT(*) AS cnt FROM Story s GROUP BY s.user.id) s
            ON u.id = s.sid
            WHERE f.id IS NULL
            AND ( :userId IS NULL OR u.id <> :userId )
            ORDER BY (COALESCE(uf.cnt, 0) + COALESCE(s.cnt, 0)) DESC, u.id DESC
            LIMIT 5
            """)
    List<User> findPopularUsers(@Param("userId") @Nullable Long userId);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.follower uf WHERE u.id = :followUserId AND uf.id = :userId")
    Boolean isFollowedByUser(@Param("followUserId") Long followUserId, @Param("userId") Long userId);

    Long countByRole_RoleName(String roleName);

    Page<User> findAllByRole_RoleNameNot(String roleName, Pageable pageable);

    Page<User> findAllByStatusAndRole_RoleNameNot(UserStatus status, String roleName, Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u WHERE (u.userHandleName LIKE %:query% OR LOWER(u.name) LIKE %:query% OR u.email LIKE %:query%) AND u.role.roleName <> :roleName")
    Page<User> searchUserAndRole_RoleNameNot(@Param("query") String query, @Param("roleName") String roleName, Pageable pageable);
}