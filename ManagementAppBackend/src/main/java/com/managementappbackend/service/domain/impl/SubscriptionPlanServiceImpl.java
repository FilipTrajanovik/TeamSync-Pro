package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.SubscriptionPlan;
import com.managementappbackend.repository.SubscriptionPlanRepository;
import com.managementappbackend.service.domain.SubscriptionPlanService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public SubscriptionPlanServiceImpl(SubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @Override
    public Optional<SubscriptionPlan> findById(Long id) {
        return subscriptionPlanRepository.findById(id);
    }

    @Override
    public Optional<SubscriptionPlan> findByName(String name) {
        return subscriptionPlanRepository.findByName(name);
    }

    @Override
    public List<SubscriptionPlan> findAllActivePlans() {
        return subscriptionPlanRepository.findByIsActive(true);
    }

    @Override
    public Optional<SubscriptionPlan> createSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        subscriptionPlan.setCreatedAt(LocalDateTime.now());
        return Optional.of(subscriptionPlanRepository.save(subscriptionPlan));
    }

    @Override
    public Optional<SubscriptionPlan> updateSubscriptionPlan(Long id, SubscriptionPlan subscriptionPlan) {
        return subscriptionPlanRepository.findById(id)
                .map(existingPlan -> {
                    existingPlan.setName(subscriptionPlan.getName());
                    existingPlan.setMaxClients(subscriptionPlan.getMaxClients());
                    existingPlan.setMaxUsers(subscriptionPlan.getMaxUsers());
                    existingPlan.setPricePerMonth(subscriptionPlan.getPricePerMonth());
                    existingPlan.setStripePriceId(subscriptionPlan.getStripePriceId());
                    existingPlan.setActive(subscriptionPlan.getActive());
                    existingPlan.setCreatedAt(subscriptionPlan.getCreatedAt());
                    existingPlan.setUpdatedAt(LocalDateTime.now());
                    return subscriptionPlanRepository.save(existingPlan);
                });
    }

    @Override
    public void deleteSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        subscriptionPlanRepository.delete(subscriptionPlan);
    }
}
