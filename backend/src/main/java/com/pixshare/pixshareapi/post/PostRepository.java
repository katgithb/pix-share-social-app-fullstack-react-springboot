package com.pixshare.pixshareapi.post;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("select p from Post p where p.user.id = ?1")
    List<Post> findByUserId(Long userId);

    @Query("select p from Post p where p.user.id in :users")
    List<Post> findAllPostsByUserIds(@Param("users") List<Long> userIds,
                                     Sort sort);
}