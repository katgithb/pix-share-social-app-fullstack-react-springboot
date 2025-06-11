package com.pixshare.pixshareapi.story;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoryRepository extends JpaRepository<Story, Long> {

    @Query("SELECT s FROM Story s WHERE s.id = :storyId AND s.user.role.roleName = :roleName")
    Optional<Story> findByIdAndUser_Role(@Param("storyId") Long storyId,
                                         @Param("roleName") String roleName);

    @Query("select s from Story s where s.user.id = :userId")
    List<Story> findStoriesByUserId(@Param("userId") Long userId,
                                    Sort sort);

    @Query("SELECT s FROM Story s WHERE s.user.id = :userId AND s.user.role.roleName = :roleName")
    List<Story> findAllStoriesByUserIdAndUser_Role(
            @Param("userId") Long userId,
            @Param("roleName") String roleName,
            Sort sort);

    @Query("SELECT s FROM Story s WHERE s.user.role.roleName = :roleName")
    List<Story> findAllStoriesByUser_Role(@Param("roleName") String roleName,
                                          Sort sort);

    void deleteByUserId(Long userId);

}