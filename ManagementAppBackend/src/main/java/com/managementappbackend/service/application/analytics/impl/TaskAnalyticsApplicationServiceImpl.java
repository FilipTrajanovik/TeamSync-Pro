package com.managementappbackend.service.application.analytics.impl;

import com.managementappbackend.dto.analytics.ClientTaskDistributionDto;
import com.managementappbackend.dto.analytics.CountByFieldDto;
import com.managementappbackend.dto.analytics.TaskStatsDto;
import com.managementappbackend.dto.analytics.TrendDataDto;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.model.exceptions.OrganizationNotFoundException;
import com.managementappbackend.service.application.analytics.TaskAnalyticsApplicationService;
import com.managementappbackend.service.domain.OrganizationService;
import com.managementappbackend.service.domain.UserService;
import com.managementappbackend.service.domain.analytics.TaskAnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskAnalyticsApplicationServiceImpl implements TaskAnalyticsApplicationService {

    private final TaskAnalyticsService taskAnalyticsService;
    private final OrganizationService organizationService;
    private final UserService userService;

    public TaskAnalyticsApplicationServiceImpl(TaskAnalyticsService taskAnalyticsService, OrganizationService organizationService, UserService userService) {
        this.taskAnalyticsService = taskAnalyticsService;
        this.organizationService = organizationService;
        this.userService = userService;
    }

    @Override
    public TaskStatsDto getTaskStats() {
       long totalCount = taskAnalyticsService.getTaskCount();
       long pending = taskAnalyticsService.getTotalByStatus(ServiceStatus.PENDING);
       long completed = taskAnalyticsService.getTotalByStatus(ServiceStatus.COMPLETED);
       long inProgress = taskAnalyticsService.getTotalByStatus(ServiceStatus.IN_PROGRESS);
       long cancelled = taskAnalyticsService.getTotalByStatus(ServiceStatus.CANCELLED);
       long onHold = taskAnalyticsService.getTotalByStatus(ServiceStatus.ON_HOLD);
       long overDue = taskAnalyticsService.getOverdueCount();
       double completionRate = totalCount > 0 ? (completed * 100.0) / totalCount : 0.0;
       return new TaskStatsDto(totalCount, pending + inProgress, completed, cancelled, onHold, completionRate, overDue);
    }

    @Override
    public List<CountByFieldDto> getCountsByField() {
        long totalCount = taskAnalyticsService.getTaskCount();

        if(totalCount == 0)
        {
            return List.of();
        }

        long lowCount = taskAnalyticsService.getByPriority(ServicePriority.LOW);
        long mediumCount = taskAnalyticsService.getByPriority(ServicePriority.MEDIUM);
        long highCount = taskAnalyticsService.getByPriority(ServicePriority.HIGH);
        long urgentCount = taskAnalyticsService.getByPriority(ServicePriority.URGENT);


        return getCountByFieldDtos(totalCount, lowCount, mediumCount, highCount, urgentCount);
    }

    @Override
    public TaskStatsDto getTaskStatsForOrganization(Long organizationId) {
        Organization org = organizationService.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization with ID: " + organizationId + " has not been found"));

        long totalCount = taskAnalyticsService.getTaskCountByOrganization(org);


        long pending = taskAnalyticsService.getTotalByStatusAndOrganization(ServiceStatus.PENDING, org);
        long completed = taskAnalyticsService.getTotalByStatusAndOrganization(ServiceStatus.COMPLETED, org);
        long inProgress = taskAnalyticsService.getTotalByStatusAndOrganization(ServiceStatus.IN_PROGRESS, org);
        long cancelled = taskAnalyticsService.getTotalByStatusAndOrganization(ServiceStatus.CANCELLED, org);
        long onHold = taskAnalyticsService.getTotalByStatusAndOrganization(ServiceStatus.ON_HOLD, org);
        long overDue = taskAnalyticsService.getOverdueCountByOrganization(org);
        double completionRate = totalCount > 0 ? (completed * 100.0) / totalCount : 0.0;
        return new TaskStatsDto(totalCount, pending + inProgress, completed, cancelled, onHold, completionRate, overDue);
    }

    @Override
    public List<CountByFieldDto> getCountsByFieldForOrganization(Long organizationId) {
        Organization org = organizationService.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization with ID: " + organizationId + " has not been found"));

        long totalCount = taskAnalyticsService.getTaskCountByOrganization(org);

        if (totalCount == 0) {
            return List.of();
        }

        long lowCount = taskAnalyticsService.getByPriorityAndOrganization(ServicePriority.LOW, org);
        long mediumCount = taskAnalyticsService.getByPriorityAndOrganization(ServicePriority.MEDIUM, org);
        long highCount = taskAnalyticsService.getByPriorityAndOrganization(ServicePriority.HIGH, org);
        long urgentCount = taskAnalyticsService.getByPriorityAndOrganization(ServicePriority.URGENT, org);

        return getCountByFieldDtos(totalCount, lowCount, mediumCount, highCount, urgentCount);

    }

    @Override
    public TaskStatsDto getTaskStatsForUser(String username) {
        User user = userService.findByUsername(username);

        long totalCount = taskAnalyticsService.getTaskCountByUser(user);

        long pending = taskAnalyticsService.getTotalByStatusAndUser(ServiceStatus.PENDING, user);
        long completed = taskAnalyticsService.getTotalByStatusAndUser(ServiceStatus.COMPLETED, user);
        long inProgress = taskAnalyticsService.getTotalByStatusAndUser(ServiceStatus.IN_PROGRESS, user);
        long cancelled = taskAnalyticsService.getTotalByStatusAndUser(ServiceStatus.CANCELLED, user);
        long onHold = taskAnalyticsService.getTotalByStatusAndUser(ServiceStatus.ON_HOLD, user);
        long overDue = taskAnalyticsService.getOverdueCountByUser(user);
        double completionRate = totalCount > 0 ? (completed * 100.0) / totalCount : 0.0;
        return new TaskStatsDto(totalCount, pending + inProgress, completed, cancelled, onHold, completionRate, overDue);
    }

    @Override
    public List<CountByFieldDto> getCountsByFieldForUser(String username) {
        User user = userService.findByUsername(username);

        long totalCount = taskAnalyticsService.getTaskCountByUser(user);

        if (totalCount == 0) {
            return List.of();
        }

        long lowCount = taskAnalyticsService.getByPriorityAndUser(ServicePriority.LOW, user);
        long mediumCount = taskAnalyticsService.getByPriorityAndUser(ServicePriority.MEDIUM, user);
        long highCount = taskAnalyticsService.getByPriorityAndUser(ServicePriority.HIGH, user);
        long urgentCount = taskAnalyticsService.getByPriorityAndUser(ServicePriority.URGENT, user);

        return getCountByFieldDtos(totalCount, lowCount, mediumCount, highCount, urgentCount);
    }

    @Override
    public List<TrendDataDto> getTaskTrend(int days) {
        List<Object[]> results = taskAnalyticsService.getTaskTrend(days);
        return convertToTrendDataDto(results);
    }

    @Override
    public List<TrendDataDto> getTaskTrendForOrganization(Long organizationId, int days) {
        Organization org = organizationService.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization with ID: " + organizationId + " has not been found"));
        List<Object[]> results = taskAnalyticsService.getTaskTrendByOrganization(org, days);
        return convertToTrendDataDto(results);
    }

    @Override
    public List<TrendDataDto> getTaskTrendForUser(String username, int days) {
        User user = userService.findByUsername(username);
        List<Object[]> results = taskAnalyticsService.getTaskTrendByUser(user, days);
        return convertToTrendDataDto(results);
    }

    @Override
    public List<ClientTaskDistributionDto> getClientTaskDistribution(Long organizationId) {
        Organization org = organizationService.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization with ID: " + organizationId + " has not been found"));
        List<Object[]> result = taskAnalyticsService.getClientsAnalytics(org);
        if(result.isEmpty()) {
            return List.of();
        }

        return result.stream()
                .map(row -> {
                    Long clientId = (Long) row[0];
                    String firstName = (String) row[1];
                    String lastName = (String) row[2];
                    Long taskCount = ((Number) row[3]).longValue();
                    Long completedCount = row[4] != null ? ((Number) row[4]).longValue() : 0L;
                    Double completionRate = taskCount > 0 ? (completedCount * 100.0) / taskCount : 0.0;

                    return new ClientTaskDistributionDto(
                            clientId,
                            firstName,
                            lastName,
                            taskCount,
                            completedCount,
                            completionRate
                    );
                })
                .toList();
    }

    private List<TrendDataDto> convertToTrendDataDto(List<Object[]> results) {
        return results.stream()
                .map(row -> new TrendDataDto(
                        (LocalDate) row[0],  // date
                        (Long) row[1],       // count
                        "Tasks Completed"
                ))
                .toList();
    }

    private List<CountByFieldDto> getCountByFieldDtos(long totalCount, long lowCount, long mediumCount, long highCount, long urgentCount) {
        CountByFieldDto lowDto = new CountByFieldDto("LOW PRIORITY", lowCount, (double) lowCount / totalCount * 100);
        CountByFieldDto mediumDto = new CountByFieldDto("MEDIUM PRIORITY", mediumCount, (double) mediumCount / totalCount * 100);
        CountByFieldDto highDto = new CountByFieldDto("HIGH PRIORITY", highCount, (double) highCount / totalCount * 100);
        CountByFieldDto urgentDto = new CountByFieldDto("URGENT PRIORITY", urgentCount, (double) urgentCount / totalCount * 100);

        List<CountByFieldDto> countByFieldDtoList = new ArrayList<>();

        countByFieldDtoList.add(lowDto);
        countByFieldDtoList.add(mediumDto);
        countByFieldDtoList.add(highDto);
        countByFieldDtoList.add(urgentDto);

        return countByFieldDtoList;
    }
}
