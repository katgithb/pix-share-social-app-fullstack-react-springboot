package com.pixshare.pixshareapi.comment;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c where c.post.id = :postId ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByPostId(@Param("postId") Long postId,
                                       Sort sort);

    @Query("SELECT c FROM Comment c where c.user.id = :userId ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByUserId(@Param("userId") Long userId, Sort sort);

    @Query("SELECT c FROM Comment c JOIN c.likedByUsers u WHERE u.id = :userId")
    List<Comment> findLikedCommentsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(c) > 0 FROM Comment c JOIN c.likedByUsers u WHERE c.id = :commentId AND u.id = :userId")
    Boolean isCommentLikedByUser(@Param("commentId") Long commentId, @Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.id IN :postIds")
    void deleteByPostIds(@Param("postIds") List<Long> postIds);

    void deleteByUserId(Long userId);

    Long countByPost_IdAndUser_Role_RoleNameNot(Long postId, String roleName);

}