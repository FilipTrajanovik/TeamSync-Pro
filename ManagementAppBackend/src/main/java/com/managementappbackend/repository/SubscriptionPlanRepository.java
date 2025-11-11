package com.managementappbackend.repository;

import com.managementappbackend.model.domain.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {

    Optional<SubscriptionPlan> findByName(String name);
    Optional<SubscriptionPlan> findByStripePriceId(String stripePriceId);
    List<SubscriptionPlan> findByIsActive(boolean active);
}
