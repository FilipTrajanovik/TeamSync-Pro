package com.managementappbackend.service.domain.analytics;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;

import java.util.List;

public interface TaskAnalyticsService {
    Long getTaskCount();
    Long getTotalByStatus(ServiceStatus status);
    Long getOverdueCount();
    Long getByPriority(ServicePriority priority);

    Long getTaskCountByOrganization(Organization organization);
    Long getTotalByStatusAndOrganization(ServiceStatus status, Organization organization);
    Long getOverdueCountByOrganization(Organization organization);
    Long getByPriorityAndOrganization(ServicePriority priority, Organization organization);

    Long getTaskCountByUser(User user);
    Long getTotalByStatusAndUser(ServiceStatus status, User user);
    Long getOverdueCountByUser(User user);
    Long getByPriorityAndUser(ServicePriority priority, User user);

    List<Object[]> getTaskTrend(int days);
    List<Object[]> getTaskTrendByOrganization(Organization org, int days);
    List<Object[]> getTaskTrendByUser(User user, int days);

    List<Object[]> getClientsAnalytics(Organization org);
}
