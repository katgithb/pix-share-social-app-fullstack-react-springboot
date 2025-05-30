package com.pixshare.pixshareapi.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    @Query("select p from Post p where p.user.id = :userId")
    Page<Post> findPostsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("select p from Post p where p.user.id in :userIds")
    Page<Post> findAllPostsByUserIds(@Param("userIds") List<Long> userIds,
                                     Pageable pageable);

    @Query("select p from Post p")
    Page<Post> findAllPosts(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.likedByUsers u WHERE u.id = :userId")
    List<Post> findLikedPostsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.savedByUsers u WHERE u.id = :userId")
    Page<Post> findSavedPostsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.likedByUsers u WHERE p.id = :postId AND u.id = :userId")
    Boolean isPostLikedByUser(@Param("postId") Long postId, @Param("userId") Long userId);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.savedByUsers u WHERE p.id = :postId AND u.id = :userId")
    Boolean isPostSavedByUser(@Param("postId") Long postId, @Param("userId") Long userId);

    void deleteByUserId(Long userId);

    /**
     * Counts the number of posts created within a specified date range.
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    Long countPostsCreatedBetween(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by day within a date range
     */
    @Query(value = "SELECT TO_CHAR(p.created_at, 'YYYY-MM-DD') AS day, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY day " +
            "ORDER BY day", nativeQuery = true)
    List<Object[]> getPostCountsByDay(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by month for a specific year
     */
    @Query(value = "SELECT EXTRACT(MONTH FROM p.created_at) AS month, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE EXTRACT(YEAR FROM p.created_at) = :year " +
            "AND p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY month " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> getPostCountsByMonth(
            @Param("year") int year,
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

    /**
     * Get post counts by month within a date range
     */
    @Query(value = "SELECT TO_CHAR(p.created_at, 'YYYY-MM') AS month, COUNT(p.id) AS post_count " +
            "FROM post p " +
            "WHERE p.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY month " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> getPostCountsByMonthInRange(
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate);

}