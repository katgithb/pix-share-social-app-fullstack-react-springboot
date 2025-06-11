package com.pixshare.pixshareapi.user;

import jakarta.annotation.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserByEmail(String email);

    boolean existsUserByUserHandleName(String username);

    boolean existsUserById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndRole_RoleName(String email, String roleName);

    Optional<User> findByUserHandleNameAndRole_RoleName(String username, String roleName);

    Optional<User> findByIdAndRole_RoleName(Long userId, String roleName);

    Page<User> findAllByRole_RoleName(String roleName, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id IN :users AND u.role.roleName = :roleName")
    List<User> findAllUsersByUserIdsAndRole_RoleName(@Param("users") List<Long> userIds,
                                                     @Param("roleName") String roleName);

    @Query("SELECT DISTINCT u FROM User u WHERE (u.userHandleName LIKE %:query% OR LOWER(u.name) LIKE %:query% OR u.email LIKE %:query%) AND u.id <> :userId AND u.role.roleName = :roleName")
    Page<User> findByQueryAndRole_RoleName(
            @Param("userId") Long userId,
            @Param("query") String query,
            @Param("roleName") String roleName,
            Pageable pageable);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN u.follower f ON f.id = :userId
            LEFT JOIN (SELECT u.id AS ufid, COUNT(*) AS cnt FROM User u INNER JOIN u.follower uf GROUP BY u.id) uf
            ON u.id = uf.ufid
            LEFT JOIN (SELECT s.user.id AS sid, COUNT(*) AS cnt FROM Story s GROUP BY s.user.id) s
            ON u.id = s.sid
            WHERE f.id IS NULL
            AND ( :userId IS NULL OR u.id <> :userId )
            AND u.role.roleName = :roleName
            ORDER BY (COALESCE(uf.cnt, 0) + COALESCE(s.cnt, 0)) DESC, u.id DESC
            LIMIT 5
            """)
    List<User> findPopularUsersByRole_RoleName(@Param("userId") @Nullable Long userId,
                                               @Param("roleName") String roleName);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.follower uf WHERE u.id = :followUserId AND uf.id = :userId AND u.role.roleName = :roleName")
    Boolean isFollowedByUserAndRole_RoleName(
            @Param("followUserId") Long followUserId,
            @Param("userId") Long userId,
            @Param("roleName") String roleName);

    Long countByRole_RoleName(String roleName);

    Page<User> findAllByRole_RoleNameNot(String roleName, Pageable pageable);

    Page<User> findAllByStatusAndRole_RoleNameNot(UserStatus status, String roleName, Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u WHERE (u.userHandleName LIKE %:query% OR LOWER(u.name) LIKE %:query% OR u.email LIKE %:query%) AND u.role.roleName <> :roleName")
    Page<User> searchUserAndRole_RoleNameNot(@Param("query") String query, @Param("roleName") String roleName, Pageable pageable);

    /**
     * Find users with ACTIVE status whose last login date is before the specified threshold.
     * Used to identify users who should be marked as INACTIVE due to inactivity.
     */
    @Query("""
            SELECT u FROM User u
            WHERE u.status = 'ACTIVE'
            AND u.lastLoginAt < :lastLoginThreshold
            AND u.role.roleName <> :roleName
            """)
    List<User> findInactiveCandidatesExcludingRole(
            @Param("lastLoginThreshold") OffsetDateTime lastLoginThreshold,
            @Param("roleName") String roleName);

    /**
     * Find users with INACTIVE status whose status change date is before the specified threshold.
     * Used to identify users who should be marked as EXPIRED due to prolonged inactivity.
     */
    @Query("""
            SELECT u FROM User u
            WHERE u.status = 'INACTIVE'
            AND u.statusChangedAt < :statusChangedThreshold
            AND u.role.roleName <> :roleName
            """)
    List<User> findExpiredCandidatesExcludingRole(
            @Param("statusChangedThreshold") OffsetDateTime statusChangedThreshold,
            @Param("roleName") String roleName);

}