package com.managementappbackend.config.init;

import com.managementappbackend.model.domain.*;
import com.managementappbackend.model.enumerations.OrganizationType;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.model.exceptions.SubscriptionPlanNotFound;
import com.managementappbackend.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ClientRepository clientRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public DataInitializer(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            ClientRepository clientRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder,
            SubscriptionPlanRepository subscriptionPlanRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.clientRepository = clientRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @PostConstruct
    public void init() {
        Random random = new Random();
        initializeSubscriptionPlans();


        // ========================================
        // 1. CREATE ADMIN USER
        // ========================================
        User admin = new User(
                "admin",
                passwordEncoder.encode("admin123"),
                "Admin",
                "User",
                Role.ADMIN
        );
        userRepository.save(admin);

        // ========================================
        // 2. CREATE MANAGERS (5 managers)
        // ========================================
        User manager1 = new User("manager1", passwordEncoder.encode("manager123"), "Michael", "Scott", Role.MANAGER);
        User manager2 = new User("manager2", passwordEncoder.encode("manager123"), "Sarah", "Johnson", Role.MANAGER);
        User manager3 = new User("manager3", passwordEncoder.encode("manager123"), "David", "Chen", Role.MANAGER);
        User manager4 = new User("manager4", passwordEncoder.encode("manager123"), "Emma", "Williams", Role.MANAGER);
        User manager5 = new User("manager5", passwordEncoder.encode("manager123"), "James", "Brown", Role.MANAGER);

        userRepository.save(manager1);
        userRepository.save(manager2);
        userRepository.save(manager3);
        userRepository.save(manager4);
        userRepository.save(manager5);

        // ========================================
        // 3. CREATE REGULAR USERS (10 users)
        // ========================================
        User user1 = new User("user1", passwordEncoder.encode("user123"), "John", "Doe", Role.USER);
        User user2 = new User("user2", passwordEncoder.encode("user123"), "Jane", "Smith", Role.USER);
        User user3 = new User("user3", passwordEncoder.encode("user123"), "Robert", "Anderson", Role.USER);
        User user4 = new User("user4", passwordEncoder.encode("user123"), "Maria", "Garcia", Role.USER);
        User user5 = new User("user5", passwordEncoder.encode("user123"), "William", "Martinez", Role.USER);
        User user6 = new User("user6", passwordEncoder.encode("user123"), "Linda", "Taylor", Role.USER);
        User user7 = new User("user7", passwordEncoder.encode("user123"), "Richard", "Lee", Role.USER);
        User user8 = new User("user8", passwordEncoder.encode("user123"), "Patricia", "White", Role.USER);
        User user9 = new User("user9", passwordEncoder.encode("user123"), "Charles", "Harris", Role.USER);
        User user10 = new User("user10", passwordEncoder.encode("user123"), "Jennifer", "Clark", Role.USER);

        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
        userRepository.save(user5);
        userRepository.save(user6);
        userRepository.save(user7);
        userRepository.save(user8);
        userRepository.save(user9);
        userRepository.save(user10);

        // ========================================
        // 4. CREATE ORGANIZATIONS (4 organizations)
        // ========================================
        Organization hospital1 = createOrganization("City Hospital", "Main city hospital", OrganizationType.HOSPITAL,
                "info@cityhospital.com", "555-1234", "123 Medical Center Drive");
        organizationRepository.save(hospital1);

        Organization hospital2 = createOrganization("St. Mary's Medical Center", "Specialized medical care", OrganizationType.HOSPITAL,
                "contact@stmarys.com", "555-2345", "456 Healthcare Boulevard");
        organizationRepository.save(hospital2);

        Organization autoShop1 = createOrganization("Quick Fix Auto Repair", "Professional auto repair", OrganizationType.AUTO_REPAIR,
                "service@quickfix.com", "555-5678", "456 Garage Street");
        organizationRepository.save(autoShop1);

        Organization autoShop2 = createOrganization("Premium Auto Service", "Luxury vehicle maintenance", OrganizationType.AUTO_REPAIR,
                "info@premiumauto.com", "555-6789", "789 Motor Avenue");
        organizationRepository.save(autoShop2);

        // ========================================
        // 5. LINK USERS TO ORGANIZATIONS
        // ========================================
        // Admin sees all organizations
        admin.getOrganizations().add(hospital1);
        admin.getOrganizations().add(hospital2);
        admin.getOrganizations().add(autoShop1);
        admin.getOrganizations().add(autoShop2);
        userRepository.save(admin);

        // Managers assigned to different organizations
        linkUserToOrg(manager1, hospital1);
        linkUserToOrg(manager2, hospital1);
        linkUserToOrg(manager3, hospital2);
        linkUserToOrg(manager4, autoShop1);
        linkUserToOrg(manager5, autoShop2);

        // Users distributed across organizations
        linkUserToOrg(user1, hospital1);
        linkUserToOrg(user2, hospital1);
        linkUserToOrg(user3, hospital1);
        linkUserToOrg(user4, hospital2);
        linkUserToOrg(user5, hospital2);
        linkUserToOrg(user6, autoShop1);
        linkUserToOrg(user7, autoShop1);
        linkUserToOrg(user8, autoShop1);
        linkUserToOrg(user9, autoShop2);
        linkUserToOrg(user10, autoShop2);

        // ========================================
        // 6. CREATE CLIENTS (20 clients)
        // ========================================
        Client[] hospital1Clients = {
                createClient("John", "Doe", "john.doe@email.com", "555-1111", "100 Patient Lane", hospital1),
                createClient("Jane", "Smith", "jane.smith@email.com", "555-2222", "101 Health Street", hospital1),
                createClient("Robert", "Wilson", "robert.w@email.com", "555-3333", "102 Care Road", hospital1),
                createClient("Mary", "Davis", "mary.d@email.com", "555-4444", "103 Wellness Ave", hospital1),
                createClient("Thomas", "Miller", "thomas.m@email.com", "555-5555", "104 Medical Plaza", hospital1)
        };

        Client[] hospital2Clients = {
                createClient("Lisa", "Moore", "lisa.m@email.com", "555-6666", "200 Clinic Way", hospital2),
                createClient("Daniel", "Taylor", "daniel.t@email.com", "555-7777", "201 Doctor Drive", hospital2),
                createClient("Nancy", "Anderson", "nancy.a@email.com", "555-8888", "202 Hospital Blvd", hospital2),
                createClient("Paul", "Thomas", "paul.t@email.com", "555-9999", "203 Care Center", hospital2),
                createClient("Karen", "Jackson", "karen.j@email.com", "555-1010", "204 Health Plaza", hospital2)
        };

        Client[] autoShop1Clients = {
                createClient("Mike", "Johnson", "mike.j@email.com", "555-2020", "300 Car Owner Ave", autoShop1),
                createClient("Susan", "White", "susan.w@email.com", "555-3030", "301 Auto Lane", autoShop1),
                createClient("Brian", "Harris", "brian.h@email.com", "555-4040", "302 Garage Road", autoShop1),
                createClient("Jessica", "Martin", "jessica.m@email.com", "555-5050", "303 Mechanic St", autoShop1),
                createClient("Kevin", "Thompson", "kevin.t@email.com", "555-6060", "304 Service Drive", autoShop1)
        };

        Client[] autoShop2Clients = {
                createClient("Laura", "Garcia", "laura.g@email.com", "555-7070", "400 Motor Way", autoShop2),
                createClient("Steven", "Martinez", "steven.m@email.com", "555-8080", "401 Vehicle Blvd", autoShop2),
                createClient("Michelle", "Robinson", "michelle.r@email.com", "555-9090", "402 Repair Road", autoShop2),
                createClient("Gary", "Clark", "gary.c@email.com", "555-1212", "403 Auto Plaza", autoShop2),
                createClient("Betty", "Rodriguez", "betty.r@email.com", "555-1313", "404 Service Center", autoShop2)
        };

        for (Client c : hospital1Clients) clientRepository.save(c);
        for (Client c : hospital2Clients) clientRepository.save(c);
        for (Client c : autoShop1Clients) clientRepository.save(c);
        for (Client c : autoShop2Clients) clientRepository.save(c);

        // ========================================
        // 7. CREATE TASKS (50 tasks with varied data for analytics)
        // ========================================
        ServiceStatus[] statuses = ServiceStatus.values();
        ServicePriority[] priorities = ServicePriority.values();

        // Hospital 1 tasks (15 tasks)
        createTasksForOrganization(hospital1, hospital1Clients, new User[]{user1, user2, user3},
                manager1, 15, statuses, priorities, random);

        // Hospital 2 tasks (12 tasks)
        createTasksForOrganization(hospital2, hospital2Clients, new User[]{user4, user5},
                manager3, 12, statuses, priorities, random);

        // Auto Shop 1 tasks (13 tasks)
        createTasksForOrganization(autoShop1, autoShop1Clients, new User[]{user6, user7, user8},
                manager4, 13, statuses, priorities, random);

        // Auto Shop 2 tasks (10 tasks)
        createTasksForOrganization(autoShop2, autoShop2Clients, new User[]{user9, user10},
                manager5, 10, statuses, priorities, random);

        // ========================================
        // SUMMARY
        // ========================================
        System.out.println("✅ Data initialization completed!");
        System.out.println("👤 Users created:");
        System.out.println("   - 1 Admin: admin/admin123");
        System.out.println("   - 5 Managers: manager1-manager5/manager123");
        System.out.println("   - 10 Users: user1-user10/user123");
        System.out.println("🏢 Organizations: 4 (2 Hospitals, 2 Auto Shops)");
        System.out.println("👥 Clients: 20 clients (5 per organization)");
        System.out.println("📋 Tasks: 50 tasks with varied statuses and priorities");
        System.out.println("");
        System.out.println("📊 Analytics Test Data:");
        System.out.println("   - Tasks distributed across all statuses");
        System.out.println("   - Tasks with different priorities");
        System.out.println("   - Tasks from last 30 days for trend analysis");
        System.out.println("   - Multiple users per organization for performance metrics");



    }

    private Organization createOrganization(String name, String description, OrganizationType type,
                                            String email, String phone, String address) {
        Organization org = new Organization();
        org.setName(name);
        org.setDescription(description);
        org.setType(type);
        org.setContactEmail(email);
        org.setContactPhone(phone);
        org.setAddress(address);
        org.setActive(true);
        org.setCreatedAt(LocalDateTime.now());
        org.setUpdatedAt(LocalDateTime.now());
        SubscriptionPlan subPlan = subscriptionPlanRepository.findByName("FREE")
                .orElseThrow(() -> new SubscriptionPlanNotFound("FREE PLAN NOT FOUND"));
        org.setSubscriptionPlan(subPlan);

        return org;
    }

    private Client createClient(String firstName, String lastName, String email,
                                String phone, String address, Organization org) {
        Client client = new Client();
        client.setFirstName(firstName);
        client.setLastName(lastName);
        client.setEmail(email);
        client.setPhone(phone);
        client.setAddress(address);
        client.setOrganization(org);
        client.setActive(true);
        client.setCreatedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());
        return client;
    }

    private void linkUserToOrg(User user, Organization org) {
        user.getOrganizations().add(org);
        userRepository.save(user);
    }

    private void createTasksForOrganization(Organization org, Client[] clients, User[] users,
                                            User manager, int count, ServiceStatus[] statuses,
                                            ServicePriority[] priorities, Random random) {
        String[] hospitalTasks = {
                "General Checkup", "Blood Test", "X-Ray Examination", "Vaccination", "Physical Therapy",
                "Dental Cleaning", "Eye Examination", "Prescription Refill", "Lab Work", "Consultation"
        };

        String[] autoTasks = {
                "Oil Change", "Brake Inspection", "Tire Rotation", "Engine Diagnostic", "Battery Replacement",
                "Transmission Service", "Air Filter Replacement", "Wheel Alignment", "Coolant Flush", "Tune-Up"
        };

        String[] taskTitles = org.getType() == OrganizationType.HOSPITAL ? hospitalTasks : autoTasks;

        for (int i = 0; i < count; i++) {
            Task task = new Task();
            task.setTitle(taskTitles[random.nextInt(taskTitles.length)]);
            task.setDescription("Task description for " + task.getTitle());
            task.setStatus(statuses[random.nextInt(statuses.length)]);
            task.setPriority(priorities[random.nextInt(priorities.length)]);

            // Create tasks from last 30 days
            int daysAgo = random.nextInt(30);
            task.setCreatedDate(LocalDateTime.now().minusDays(daysAgo));
            task.setUpdatedDate(LocalDateTime.now().minusDays(daysAgo));

            // Set due date based on priority
            int dueDays = task.getPriority() == ServicePriority.URGENT ? 1 :
                    task.getPriority() == ServicePriority.HIGH ? 3 :
                            task.getPriority() == ServicePriority.MEDIUM ? 7 : 14;
            task.setDueDate(task.getCreatedDate().plusDays(dueDays));

            // Set completed date for completed tasks
            if (task.getStatus() == ServiceStatus.COMPLETED) {
                task.setCompletedDate(task.getCreatedDate().plusDays(random.nextInt(dueDays)));
                task.setFinished(true);
            }

            task.setClient(clients[random.nextInt(clients.length)]);
            task.setAssignedToUserId(users[random.nextInt(users.length)]);
            task.setCreatedByUserId(manager);
            task.setOrganization(org);

            taskRepository.save(task);
        }
    }


    private void initializeSubscriptionPlans() {
        if (subscriptionPlanRepository.count() == 0) {
            // FREE Plan
            SubscriptionPlan freePlan = new SubscriptionPlan(
                    "FREE",
                    "Free Plan",
                    0.0,
                    10,
                    50,
                    true,
                    null, // No Stripe price ID for free
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );

            // PRO Plan
            SubscriptionPlan proPlan = new SubscriptionPlan(
                    "PRO",
                    "Pro Plan",
                    39.0,
                    -1, // unlimited users
                    -1, // unlimited clients
                    true,
                    "price_1SRXb49nRU2GQ5J44M3EnN8T", // We'll add Stripe price ID later
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );

            // ENTERPRISE Plan
            SubscriptionPlan enterprisePlan = new SubscriptionPlan(
                    "ENTERPRISE",
                    "Enterprise Plan",
                    799.0,
                    -1, // unlimited
                    -1, // unlimited
                    true,
                    null, // We'll add Stripe price ID later
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );

            subscriptionPlanRepository.save(freePlan);
            subscriptionPlanRepository.save(proPlan);
            subscriptionPlanRepository.save(enterprisePlan);

            System.out.println("✅ Subscription plans initialized");
        }
    }
}