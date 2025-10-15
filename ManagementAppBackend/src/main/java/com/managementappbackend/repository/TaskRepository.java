package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByTitle(String title);

    @Query("SELECT r FROM Task r WHERE r.client.Id = :clientId")
    List<Task> findByClientId(Long clientId);

    List<Task> findByAssignedToUserId(User user);

}
