package com.pixshare.pixshareapi.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}