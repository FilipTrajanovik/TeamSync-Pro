package com.managementappbackend.config.init;

import com.managementappbackend.model.domain.*;
import com.managementappbackend.model.domain.Record;
import com.managementappbackend.model.enumerations.OrganizationType;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ClientRepository clientRepository;
    private final TaskRepository taskRepository;
    private final RecordRepository recordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            ClientRepository clientRepository,
            TaskRepository taskRepository,
            RecordRepository recordRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.clientRepository = clientRepository;
        this.taskRepository = taskRepository;
        this.recordRepository = recordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        // ========================================
        // 1. CREATE USERS FIRST
        // ========================================
        User admin = new User(
                "admin",
                passwordEncoder.encode("admin123"),
                "Admin",
                "User",
                Role.ADMIN
        );
        userRepository.save(admin);

        User manager = new User(
                "manager",
                passwordEncoder.encode("manager123"),
                "Manager",
                "Smith",
                Role.MANAGER
        );
        userRepository.save(manager);

        User regularUser = new User(
                "user",
                passwordEncoder.encode("user123"),
                "Regular",
                "User",
                Role.USER
        );
        userRepository.save(regularUser);

        // ========================================
        // 2. CREATE ORGANIZATIONS
        // ========================================
        Organization hospital = new Organization();
        hospital.setName("City Hospital");
        hospital.setDescription("Main city hospital providing general healthcare");
        hospital.setType(OrganizationType.HOSPITAL);
        hospital.setContactEmail("info@cityhospital.com");
        hospital.setContactPhone("555-1234");
        hospital.setAddress("123 Medical Center Drive");
        hospital.setActive(true);
        hospital.setCreatedAt(LocalDateTime.now());
        hospital.setUpdatedAt(LocalDateTime.now());
        organizationRepository.save(hospital);

        Organization autoShop = new Organization();
        autoShop.setName("Quick Fix Auto Repair");
        autoShop.setDescription("Professional auto repair and maintenance services");
        autoShop.setType(OrganizationType.AUTO_REPAIR);
        autoShop.setContactEmail("service@quickfix.com");
        autoShop.setContactPhone("555-5678");
        autoShop.setAddress("456 Garage Street");
        autoShop.setActive(true);
        autoShop.setCreatedAt(LocalDateTime.now());
        autoShop.setUpdatedAt(LocalDateTime.now());
        organizationRepository.save(autoShop);

        // ========================================
        // 3. LINK USERS TO ORGANIZATIONS
        // ========================================
        admin.getOrganizations().add(hospital);
        admin.getOrganizations().add(autoShop); // Admin can see both organizations

        manager.getOrganizations().add(autoShop); // Manager belongs to Auto Shop

        regularUser.getOrganizations().add(hospital); // Regular user belongs to Hospital

        // CRITICAL: Save users again after linking organizations
        userRepository.save(admin);
        userRepository.save(manager);
        userRepository.save(regularUser);

        // ========================================
        // 4. CREATE CLIENTS
        // ========================================
        Client client1 = new Client();
        client1.setFirstName("John");
        client1.setLastName("Doe");
        client1.setEmail("john.doe@email.com");
        client1.setPhone("555-1111");
        client1.setAddress("789 Patient Lane");
        client1.setOrganization(hospital);
        client1.setActive(true);
        client1.setCreatedAt(LocalDateTime.now());
        client1.setUpdatedAt(LocalDateTime.now());
        clientRepository.save(client1);

        Client client2 = new Client();
        client2.setFirstName("Jane");
        client2.setLastName("Smith");
        client2.setEmail("jane.smith@email.com");
        client2.setPhone("555-2222");
        client2.setAddress("321 Customer Road");
        client2.setOrganization(hospital);
        client2.setActive(true);
        client2.setCreatedAt(LocalDateTime.now());
        client2.setUpdatedAt(LocalDateTime.now());
        clientRepository.save(client2);

        Client client3 = new Client();
        client3.setFirstName("Mike");
        client3.setLastName("Johnson");
        client3.setEmail("mike.johnson@email.com");
        client3.setPhone("555-3333");
        client3.setAddress("654 Car Owner Avenue");
        client3.setOrganization(autoShop);
        client3.setActive(true);
        client3.setCreatedAt(LocalDateTime.now());
        client3.setUpdatedAt(LocalDateTime.now());
        clientRepository.save(client3);

        // ========================================
        // 5. CREATE TASKS
        // ========================================
        Task task1 = new Task();
        task1.setTitle("General Checkup");
        task1.setDescription("Annual physical examination for patient");
        task1.setStatus(ServiceStatus.PENDING);
        task1.setPriority(ServicePriority.MEDIUM);
        task1.setDueDate(LocalDateTime.now().plusDays(7));
        task1.setClient(client1);
        task1.setAssignedToUserId(regularUser);
        task1.setCreatedByUserId(admin);
        task1.setOrganization(hospital);
        task1.setCreatedDate(LocalDateTime.now());
        task1.setUpdatedDate(LocalDateTime.now());
        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setTitle("Blood Test Results Review");
        task2.setDescription("Review and discuss blood test results with patient");
        task2.setStatus(ServiceStatus.IN_PROGRESS);
        task2.setPriority(ServicePriority.HIGH);
        task2.setDueDate(LocalDateTime.now().plusDays(2));
        task2.setClient(client2);
        task2.setAssignedToUserId(regularUser);
        task2.setCreatedByUserId(admin);
        task2.setOrganization(hospital);
        task2.setCreatedDate(LocalDateTime.now());
        task2.setUpdatedDate(LocalDateTime.now());
        taskRepository.save(task2);

        Task task3 = new Task();
        task3.setTitle("Oil Change Service");
        task3.setDescription("Regular oil change and filter replacement");
        task3.setStatus(ServiceStatus.COMPLETED);
        task3.setPriority(ServicePriority.LOW);
        task3.setDueDate(LocalDateTime.now().minusDays(1));
        task3.setCompletedDate(LocalDateTime.now());
        task3.setClient(client3);
        task3.setAssignedToUserId(manager);
        task3.setCreatedByUserId(manager);
        task3.setOrganization(autoShop);
        task3.setCreatedDate(LocalDateTime.now().minusDays(2));
        task3.setUpdatedDate(LocalDateTime.now());
        taskRepository.save(task3);

        Task task4 = new Task();
        task4.setTitle("Brake Inspection");
        task4.setDescription("Inspect brake pads and rotors");
        task4.setStatus(ServiceStatus.PENDING);
        task4.setPriority(ServicePriority.URGENT);
        task4.setDueDate(LocalDateTime.now().plusDays(1));
        task4.setClient(client3);
        task4.setAssignedToUserId(manager);
        task4.setCreatedByUserId(manager);
        task4.setOrganization(autoShop);
        task4.setCreatedDate(LocalDateTime.now());
        task4.setUpdatedDate(LocalDateTime.now());
        taskRepository.save(task4);

        // ========================================
        // 6. CREATE RECORDS
        // ========================================
        Record record1 = new Record();
        record1.setClient(client1);
        record1.setProfileType("MEDICAL");
        record1.setJsonData("{\"bloodType\":\"O+\",\"allergies\":[\"Penicillin\"],\"conditions\":[\"Hypertension\"]}");
        record1.setCreatedAt(LocalDateTime.now());
        record1.setUpdatedAt(LocalDateTime.now());
        recordRepository.save(record1);

        Record record2 = new Record();
        record2.setClient(client2);
        record2.setProfileType("MEDICAL");
        record2.setJsonData("{\"bloodType\":\"A-\",\"allergies\":[],\"conditions\":[]}");
        record2.setCreatedAt(LocalDateTime.now());
        record2.setUpdatedAt(LocalDateTime.now());
        recordRepository.save(record2);

        Record record3 = new Record();
        record3.setClient(client3);
        record3.setProfileType("VEHICLE");
        record3.setJsonData("{\"make\":\"Toyota\",\"model\":\"Camry\",\"year\":2020,\"mileage\":45000,\"lastService\":\"2024-09-15\"}");
        record3.setCreatedAt(LocalDateTime.now());
        record3.setUpdatedAt(LocalDateTime.now());
        recordRepository.save(record3);

        System.out.println("✅ Data initialization completed!");
        System.out.println("👤 Users created: admin/admin123, manager/manager123, user/user123");
        System.out.println("🏢 Organizations: City Hospital, Quick Fix Auto Repair");
        System.out.println("👥 Clients: 3 clients created (2 Hospital, 1 Auto Shop)");
        System.out.println("📋 Tasks: 4 tasks created (2 Hospital, 2 Auto Shop)");
        System.out.println("📄 Records: 3 records created");
        System.out.println("");
        System.out.println("🔗 User-Organization Links:");
        System.out.println("   - admin: Hospital + Auto Shop (can manage both)");
        System.out.println("   - manager: Auto Shop only");
        System.out.println("   - user: Hospital only");
    }
}