package com.managementappbackend.service.domain.analytics.impl;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.repository.ClientRepository;
import com.managementappbackend.repository.TaskRepository;
import com.managementappbackend.service.domain.analytics.TaskAnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskAnalyticsServiceImpl implements TaskAnalyticsService {

    private final TaskRepository taskRepository;
    private final ClientRepository clientRepository;

    public TaskAnalyticsServiceImpl(TaskRepository taskRepository, ClientRepository clientRepository) {
        this.taskRepository = taskRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public Long getTaskCount() {
        return taskRepository.count();
    }

    @Override
    public Long getTotalByStatus(ServiceStatus status) {
        return taskRepository.countByStatus(status);
    }

    @Override
    public Long getOverdueCount() {
        return taskRepository.countOverdue();
    }

    @Override
    public Long getByPriority(ServicePriority priority) {
        return taskRepository.countByPriority(priority);
    }

    @Override
    public Long getTaskCountByOrganization(Organization organization) {
        return taskRepository.countByOrganization(organization);
    }

    @Override
    public Long getTotalByStatusAndOrganization(ServiceStatus status, Organization organization) {
        return taskRepository.countByStatusAndOrganization(status, organization);
    }

    @Override
    public Long getOverdueCountByOrganization(Organization organization) {
        return taskRepository.countOverdueByOrganization(organization);
    }

    @Override
    public Long getByPriorityAndOrganization(ServicePriority priority, Organization organization) {
        return taskRepository.countByPriorityAndOrganization(priority, organization);
    }

    @Override
    public Long getTaskCountByUser(User user) {
        return taskRepository.countByAssignedToUserId(user);
    }

    @Override
    public Long getTotalByStatusAndUser(ServiceStatus status, User user) {
        return taskRepository.countByStatusAndAssignedToUserId(status, user);
    }

    @Override
    public Long getOverdueCountByUser(User user) {
        return taskRepository.countOverdueByUser(user);
    }

    @Override
    public Long getByPriorityAndUser(ServicePriority priority, User user) {
        return taskRepository.countByPriorityAndAssignedToUserId(priority, user);
    }

    @Override
    public List<Object[]> getTaskTrend(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return taskRepository.findTaskTrendData(startDate);
    }

    @Override
    public List<Object[]> getTaskTrendByOrganization(Organization org, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return taskRepository.findTaskTrendDataByOrganization(org, startDate);
    }

    @Override
    public List<Object[]> getTaskTrendByUser(User user, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return taskRepository.findTaskTrendDataByUser(user, startDate);
    }

    @Override
    public List<Object[]> getClientsAnalytics(Organization org) {
        return clientRepository.findClientTaskDistribution(org);
    }
}
