# TeamSync Pro - Multi-Tenant Task Management SaaS

A comprehensive, professional-grade task management application designed for various business types including hospitals, auto repair shops, and service businesses.

## 🚀 Overview

TeamSync Pro is a Spring Boot + React SaaS application featuring multi-tenant architecture, role-based access control, Stripe payment integration, and a modern glassmorphism UI inspired by Apple's design language.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Subscription Plans](#subscription-plans)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development Status](#development-status)

---

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER, MANAGER, ADMIN, OWNER)
- Secure registration with organization creation
- Multi-tenant data isolation

### Free Plan Features (✅ Completed)
- **User Management**
  - Up to 5 users per organization
  - Create and manage team members
  - Role assignment and management
  
- **Task Management**
  - Create, update, and delete tasks
  - Assign tasks to team members
  - Task status tracking (PENDING, IN_PROGRESS, COMPLETED, ON_HOLD)
  - Priority levels (LOW, MEDIUM, HIGH)
  - Due date management
  - Task filtering and search
  
- **Client Management**
  - Client profiles with contact information
  - Client-task association
  - Progress tracking per client
  
- **Analytics Dashboard**
  - Task statistics (total, completed, pending, on hold)
  - Priority distribution charts (Donut/Pie charts)
  - Task trends over time (Line charts)
  - Client performance overview (Horizontal bar charts)
  - Manager-specific analytics
  
- **Comments System**
  - Task-specific comments
  - Real-time collaboration
  - Comment history
  
- **Notifications**
  - Task assignment notifications
  - Comment notifications
  - Unread notification counter
  - Mark as read/unread functionality
  
- **Settings & Profile Management**
  - User profile updates (name, surname)
  - Password change with current password verification
  - Organization information management

### Pro Plan Features (🔄 Planned)
- Unlimited users
- Advanced task management with AI suggestions
- Client portal access
- Calendar integration
- Advanced analytics and reporting
- Custom task workflows
- Email notifications
- File attachments

### Enterprise Plan Features (🔄 Planned)
- Everything in PRO
- Custom integrations
- Priority support
- White-label options
- Advanced business intelligence
- API access
- Dedicated account manager
- Custom SLA

---

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: H2 (development), PostgreSQL (production planned)
- **Security**: Spring Security with JWT
- **Payment**: Stripe API
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Styling**: CSS Modules with Glassmorphism design
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Payment Integration
- **Provider**: Stripe
- **Features**: Subscription management, Webhook handling
- **Test Mode**: Stripe CLI for local webhook forwarding

---

## 🏗 Architecture

### Domain-Driven Design
The application follows DDD principles with clear separation:
- **Domain Layer**: Pure business logic (User, Organization, Task, Client, etc.)
- **Application Service Layer**: Orchestrates domain logic, handles DTOs
- **Web Layer**: REST controllers, filters, exception handlers

### Multi-Tenancy
- Organization-based data isolation
- Users belong to organizations via many-to-many relationship
- All queries filtered by organization context

### Security Architecture
- JWT tokens for stateless authentication
- Role-based endpoint protection
- Custom JWT filter for token validation
- Public endpoints for registration, login, webhooks

### Database Schema
```
Users ←→ Organizations ←→ Subscription Plans
  ↓           ↓
Tasks ←→ Clients
  ↓
Comments
  ↓
Notifications
```

---

## 💳 Subscription Plans

### FREE Plan
- **Price**: $0/month
- **Users**: Up to 5
- **Features**: 
  - Basic task management
  - Client management
  - Basic analytics
  - Comments system
  - Notifications

### PRO Plan
- **Price**: $39/month
- **Stripe Price ID**: `price_1SRXb49nRU2GQ5J44M3EnN8T`
- **Users**: Unlimited
- **Features**: Everything in FREE plus:
  - Advanced task management
  - AI-powered suggestions
  - Client portal
  - Calendar integration
  - Advanced analytics

### ENTERPRISE Plan
- **Price**: $799/month
- **Stripe Price ID**: TBD
- **Users**: Unlimited
- **Features**: Everything in PRO plus:
  - Custom integrations
  - Priority support
  - White-label options
  - API access
  - Custom SLA

---

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- Maven 3.8+
- Stripe CLI (for webhook testing)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/FilipTrajanovik/TeamSync-Pro.git
cd management-app-backend
```

2. **Configure application.properties**
```properties
spring.application.name=ManagementAppBackend
spring.datasource.url=jdbc:h2:mem:managementdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
spring.h2.console.path=/h2
spring.datasource.username=ft
spring.datasource.password=ft

# Stripe Configuration
stripe.api.key=sk_test_YOUR_STRIPE_SECRET_KEY
stripe.webhook.secret=whsec_YOUR_WEBHOOK_SECRET
app.frontend.url=http://localhost:5173
```

3. **Run the application**
```bash
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

4. **Set up Stripe webhooks (for local development)**
```bash
stripe login
stripe listen --forward-to localhost:8080/api/billing/webhook
```
Copy the webhook signing secret and add to `application.properties`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd management-app-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

### Initial Data
The application includes a `DataInitializer` that creates:
- 3 subscription plans (FREE, PRO, ENTERPRISE)
- Sample organizations with managers
- Test users and tasks for each organization

**Test Credentials:**
- Manager 1: `manager1` / `manager123`
- Manager 2: `manager2` / `manager123`
- Admin: `admin` / `admin`

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Stripe Test Cards
Use these test cards in Stripe checkout:

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date (12/34)
CVC: Any 3 digits (123)
ZIP: Any 5 digits (12345)
```

**Declined Card:**
```
Card: 4000 0000 0000 0002
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - Register new organization with manager
- `POST /api/users/login` - User login (returns JWT)

### User Management
- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/managers` - Get all managers
- `GET /api/users/organization/{id}` - Get users by organization
- `POST /api/users/create` - Create new user (MANAGER+)
- `PUT /api/users/update` - Update user profile
- `PUT /api/users/change-password` - Change password

### Task Management
- `GET /api/tasks/organization-tasks` - Get organization tasks (MANAGER+)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}/update` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/toggle-finish` - Toggle task completion

### Client Management
- `GET /api/clients/organization/{id}` - Get clients by organization
- `POST /api/clients` - Create client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Analytics
- `GET /api/analytics/manager/tasks/stats` - Task statistics
- `GET /api/analytics/manager/tasks/priority-distribution` - Priority distribution
- `GET /api/analytics/manager/tasks/trend` - Task trend over time
- `GET /api/analytics/manager/clients/task-distribution` - Client task distribution

### Billing
- `GET /api/billing/plans` - Get active subscription plans (PUBLIC)
- `POST /api/billing/checkout` - Create Stripe checkout session
- `POST /api/billing/webhook` - Stripe webhook handler (PUBLIC)

### Comments
- `GET /api/comments/task/{taskId}` - Get comments for task
- `POST /api/comments` - Create comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Notifications
- `GET /api/notifications/my-notifications` - Get user notifications
- `GET /api/notifications/count-my-notifications` - Get unread count
- `PUT /api/notifications/{id}/mark-as-read` - Mark as read
- `PUT /api/notifications/{id}/mark-as-unread` - Mark as unread

---

## 📁 Project Structure

### Backend
```
src/main/java/com/managementappbackend/
├── config/
│   └── security/          # Security configuration, CORS
├── constants/             # JWT constants
├── dto/                   # Data Transfer Objects
├── helpers/               # JWT helper classes
├── model/
│   ├── domain/           # Domain entities
│   ├── enumerations/     # Enums (Role, Status, Priority)
│   └── exceptions/       # Custom exceptions
├── repository/           # JPA repositories
├── service/
│   ├── application/      # Application services (DTOs)
│   └── domain/          # Domain services (pure logic)
└── web/
    ├── controllers/      # REST controllers
    └── filters/         # JWT filter
```

### Frontend
```
src/
├── axios/               # Axios instance configuration
├── context/
│   ├── AuthContext.jsx  # Authentication context
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useClients.js
│   ├── useAnalytics.js
│   ├── useBilling.js
│   └── ...
├── repository/         # API call abstractions
│   ├── userRepository.js
│   ├── taskRepository.js
│   ├── billingRepository.js
│   └── ...
└── ui/
    ├── components/     # Reusable components
    │   ├── Task/
    │   ├── Client/
    │   ├── Comments/
    │   ├── Navbar/
    │   └── ...
    └── pages/         # Page components
        ├── Manager/
        ├── Admin/
        ├── User/
        ├── LandingPage/
        └── Settings/
```

---

## 📊 Development Status

### Completed (✅ ~85% of FREE Plan)
- [x] Authentication system (JWT)
- [x] User registration with organization creation
- [x] Multi-role dashboards (USER, MANAGER, ADMIN, OWNER)
- [x] Task management (CRUD, filtering, search)
- [x] Client management
- [x] Analytics with charts
- [x] Comments system
- [x] Notifications
- [x] Settings & profile management
- [x] Stripe payment integration
- [x] Subscription plan management
- [x] Professional landing page
- [x] Glassmorphism UI design

### In Progress (🔄)
- [ ] Help documentation
- [ ] Complete settings pages
- [ ] Email notifications

### Planned (📋)
- [ ] PRO plan features
  - [ ] AI-powered task suggestions
  - [ ] Calendar integration
  - [ ] Client portal
  - [ ] Advanced workflows
- [ ] ENTERPRISE plan features
  - [ ] Custom integrations
  - [ ] API access
  - [ ] White-label options
- [ ] Production deployment
  - [ ] PostgreSQL migration
  - [ ] Docker containerization
  - [ ] CI/CD pipeline
  - [ ] Production Stripe webhook setup

---

## 🎨 UI/UX Design

### Design System
- **Theme**: Black & White Glassmorphism
- **Inspiration**: Apple iOS/MacOS aesthetic
- **Key Features**:
  - Backdrop blur effects
  - Transparent backgrounds with subtle borders
  - High contrast text
  - Smooth animations
  - Responsive design

### Color Palette
- **Background**: Pure black (#000000)
- **Glass surfaces**: rgba(255, 255, 255, 0.05) with backdrop blur
- **Text**: White with various opacity levels
- **Accents**: Subtle gradients and glows

---

## 🔐 Security Features

### Authentication
- JWT tokens with expiration
- Secure password encoding (BCrypt)
- Token refresh mechanism
- Protected routes

### Authorization
- Role-based access control
- Organization-based data isolation
- Endpoint-level security
- Custom security filters

### Data Protection
- SQL injection prevention (JPA)
- XSS protection
- CSRF protection (disabled for API)
- CORS configuration

---

## 🧪 Testing

### Test Accounts
| Username | Password | Role | Organization |
|----------|----------|------|--------------|
| admin | admin | ADMIN | City Hospital |
| manager1 | manager123 | MANAGER | City Hospital |
| manager2 | manager123 | MANAGER | St. Mary's Medical Center |
| manager3 | manager123 | MANAGER | Quick Fix Auto Repair |
| user1 | user123 | USER | City Hospital |

### Stripe Testing
- Use Stripe test mode API keys
- Use Stripe CLI for local webhook testing
- Test cards provided in configuration section

---

## 🐛 Known Issues & Troubleshooting

### Issue: Webhooks returning 403
**Solution**: Ensure webhook endpoint is in public endpoints list in SecurityConfig and JwtFilter

### Issue: User has no organizations
**Solution**: Check User entity @ManyToMany relationship has @JoinTable annotation

### Issue: H2 console not accessible
**Solution**: Add H2 console paths to SecurityConfig permitAll list

### Issue: Frontend shows stale data after payment
**Solution**: Hard refresh browser (Ctrl+Shift+R) or implement automatic data refresh

---

## 📝 License

This project is proprietary and confidential.

---

## 👥 Contributors

- **Filip** - Full Stack Developer

---

## 🙏 Acknowledgments

- Spring Boot team for excellent framework
- Stripe for seamless payment integration
- Material-UI for comprehensive component library
- React team for amazing frontend framework

---

## 📧 Contact

For questions or support, please contact: filiptrajanovik@gmail.com

---

## 🗺 Roadmap

### Q1 2025
- [ ] Complete FREE plan features
- [ ] Begin PRO plan implementation
- [ ] Set up production environment

### Q2 2025
- [ ] Complete PRO plan features
- [ ] Beta testing program
- [ ] Performance optimization

### Q3 2025
- [ ] Launch to production
- [ ] Marketing campaign
- [ ] Begin ENTERPRISE features

### Q4 2025
- [ ] Scale infrastructure
- [ ] Add more integrations
- [ ] International expansion

---

**Built with ❤️ by Filip**