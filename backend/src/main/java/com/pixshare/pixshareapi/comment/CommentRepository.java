package com.pixshare.pixshareapi.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Post p JOIN p.comments c WHERE p.id = :postId ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByPostId(@Param("postId") Long postId);

}