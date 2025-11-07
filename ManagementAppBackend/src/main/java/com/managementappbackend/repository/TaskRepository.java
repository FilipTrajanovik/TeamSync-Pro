package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByTitle(String title);

    @Query("SELECT r FROM Task r WHERE r.client.Id = :clientId")
    List<Task> findByClientId(Long clientId);

    List<Task> findByAssignedToUserId(User user);

    List<Task> findByStatus(ServiceStatus serviceStatus);
    Long countByStatus(ServiceStatus serviceStatus);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < CURRENT_DATE AND t.status != 'COMPLETED'")
    Long countOverdue();

    Long countByPriority(ServicePriority servicePriority);

    Long countByOrganization(Organization organization);
    Long countByStatusAndOrganization(ServiceStatus serviceStatus, Organization organization);
    Long countByPriorityAndOrganization(ServicePriority servicePriority, Organization organization);

    @Query("SELECT COUNT(t) FROM Task t " +
            "WHERE t.organization = :organization " +
            "AND t.dueDate < CURRENT_DATE " +
            "AND t.status != 'COMPLETED'")
    Long countOverdueByOrganization(@Param("organization") Organization organization);

    Long countByAssignedToUserId(User user);
    Long countByStatusAndAssignedToUserId(ServiceStatus serviceStatus, User user);
    Long countByPriorityAndAssignedToUserId(ServicePriority servicePriority, User user);

    @Query("SELECT COUNT(t) FROM Task t " +
            "WHERE t.assignedToUserId = :user " +
            "AND t.dueDate < CURRENT_DATE " +
            "AND t.status != 'COMPLETED'")
    Long countOverdueByUser(@Param("user") User user);

    // ⭐ CHANGED: DATE() → CAST() for H2 compatibility
    @Query("SELECT CAST(t.completedDate AS date) as date, COUNT(t) as count " +
            "FROM Task t " +
            "WHERE t.completedDate >= :startDate " +
            "AND t.status = 'COMPLETED' " +
            "GROUP BY CAST(t.completedDate AS date) " +
            "ORDER BY CAST(t.completedDate AS date)")
    List<Object[]> findTaskTrendData(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT CAST(t.completedDate AS date) as date, COUNT(t) as count " +
            "FROM Task t " +
            "WHERE t.organization = :organization " +
            "AND t.completedDate >= :startDate " +
            "AND t.status = 'COMPLETED' " +
            "GROUP BY CAST(t.completedDate AS date) " +
            "ORDER BY CAST(t.completedDate AS date)")
    List<Object[]> findTaskTrendDataByOrganization(
            @Param("organization") Organization organization,
            @Param("startDate") LocalDateTime startDate
    );

    @Query("SELECT CAST(t.completedDate AS date) as date, COUNT(t) as count " +
            "FROM Task t " +
            "WHERE t.assignedToUserId = :user " +
            "AND t.completedDate >= :startDate " +
            "AND t.status = 'COMPLETED' " +
            "GROUP BY CAST(t.completedDate AS date) " +
            "ORDER BY CAST(t.completedDate AS date)")
    List<Object[]> findTaskTrendDataByUser(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate
    );

    List<Task> findAllByAssignedToUserIdAndStatus(User user, ServiceStatus status);
    List<Task> findByOrganization(Organization organization);
}