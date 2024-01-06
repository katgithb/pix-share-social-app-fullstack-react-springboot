package com.pixshare.pixshareapi.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("select p from Post p where p.user.id = ?1")
    List<Post> findByUserId(Long userId);

    @Query("select p from Post p where p.user.id in :users")
    Page<Post> findAllPostsByUserIds(@Param("users") List<Long> userIds,
                                     Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.likedByUsers u WHERE u.id = :userId")
    List<Post> findLikedPostsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.likedByUsers u WHERE p.id = :postId AND u.id = :userId")
    Boolean isPostLikedByUser(@Param("postId") Long postId, @Param("userId") Long userId);

    @Query("SELECT COUNT(p) > 0 FROM Post p JOIN p.savedByUsers u WHERE p.id = :postId AND u.id = :userId")
    Boolean isPostSavedByUser(@Param("postId") Long postId, @Param("userId") Long userId);

    void deleteByUserId(Long userId);
}