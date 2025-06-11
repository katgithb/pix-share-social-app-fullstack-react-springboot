package com.pixshare.pixshareapi.comment;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.id = :commentId AND c.user.role.roleName = :roleName")
    Optional<Comment> findByIdAndUser_Role(@Param("commentId") Long commentId,
                                           @Param("roleName") String roleName);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.user.role.roleName = :roleName ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByPostIdAndUser_Role(
            @Param("postId") Long postId,
            @Param("roleName") String roleName,
            Sort sort);

    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId AND c.user.role.roleName = :roleName ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByUserIdAndUser_Role(
            @Param("userId") Long userId,
            @Param("roleName") String roleName,
            Sort sort);

    @Query("SELECT c FROM Comment c JOIN c.likedByUsers u WHERE u.id = :userId")
    List<Comment> findLikedCommentsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c JOIN c.likedByUsers u WHERE u.id = :userId AND c.user.role.roleName = :roleName")
    List<Comment> findLikedCommentsByUserIdAndUser_Role(@Param("userId") Long userId,
                                                        @Param("roleName") String roleName);

    @Query("SELECT COUNT(c) > 0 FROM Comment c JOIN c.likedByUsers u WHERE c.id = :commentId AND u.id = :userId AND c.user.role.roleName = :roleName")
    Boolean isCommentLikedByUserAndUser_Role(
            @Param("commentId") Long commentId,
            @Param("userId") Long userId,
            @Param("roleName") String roleName);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.id IN :postIds")
    void deleteByPostIds(@Param("postIds") List<Long> postIds);

    void deleteByUserId(Long userId);

    Long countByPost_IdAndUser_Role_RoleNameNot(Long postId, String roleName);

}