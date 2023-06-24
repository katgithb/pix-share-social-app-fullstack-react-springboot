package com.pixshare.pixshareapi.story;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {

    @Query("select s from Story s where s.user.id = :userId")
    List<Story> findStoriesByUserId(@Param("userId") Long userId,
                                    Sort sort);

}