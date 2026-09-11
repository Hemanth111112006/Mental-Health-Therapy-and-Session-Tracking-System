# Mental Health Therapy and Session Tracking System (MHTSTS)

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

The **Mental Health Therapy and Session Tracking System (MHTSTS)** (also referred to as **MindCare EHR**) is an enterprise-grade, HIPAA-aligned Electronic Health Record (EHR) and clinical session tracking platform designed for multidisciplinary mental health clinics, counseling centers, and psychiatric practices.

The platform provides end-to-end clinical workflow automation—from patient onboarding, appointment scheduling, and front-desk reception to clinical documentation (SOAP, DAP, BIRP notes), psychiatric medication management, psychological assessment tracking, treatment plan generation, crisis intervention safety planning, supervisory co-signature workflows, and insurance billing.

---

## Key Features

- **Role-Based Access Control (RBAC):** 8 discrete roles with distinct navigation, permission boundaries, and clinical segregation of duties.
- **Clinical Documentation:** Standardized clinical note formats (SOAP, DAP, and BIRP) with supervisor review queues and co-signature requirements.
- **Treatment Planning & Goal Tracking:** Structured care plans with measurable objectives, target completion dates, clinical modalities, and PDF export.
- **Psychological Assessments & Outcome Tracking:** Standardized score tracking for PHQ-9 (Depression), GAD-7 (Anxiety), MMPI-3, and PCL-5.
- **Psychiatric Medication Management:** Medication review schedules, prescription renewal tracking, dosage management, and high-risk case flags.
- **Crisis Assessment & Safety Planning:** Rapid suicide/self-harm risk identification, personalized coping strategies, warning signs, and emergency contact registries.
- **Front-Desk Reception & Scheduling:** Multi-provider appointment calendars, live waiting room queue tracking, and one-click patient check-in/check-out.
- **Case Management & Referrals:** Community resource directories, external referral tracking, and care coordination logs.
- **Billing & Claims Auditing:** Insurance verification tracking, service fee schedules, copay collection, and audit reporting.
- **Enterprise Security:** Spring Security 6 with stateless JWT authentication, BCrypt password hashing, method-level `@PreAuthorize` guards, and immutable audit logs.

---

## Supported Roles & Dashboards

| Role | Identifiers / Codes | Workspace & Responsibilities |
| :--- | :--- | :--- |
| **System Administrator** | `ADMIN` / `ROLE_ADMIN` | User provisioning, RBAC role management, database health, audit log review, and system configuration. |
| **Therapist / Counselor** | `THERAPIST` / `ROLE_THERAPIST` | Caseload management, therapy scheduling, SOAP/DAP/BIRP notes, treatment plans, and crisis screening. |
| **Psychiatrist** | `PSYCHIATRIST` / `ROLE_PSYCHIATRIST` | Psychiatric evaluations, psychotropic medication management, prescription reviews, and high-risk monitoring. |
| **Psychologist** | `PSYCHOLOGIST` / `ROLE_PSYCHOLOGIST` | Psychological test batteries (PHQ-9, GAD-7, MMPI-3), diagnostic scoring, and assessment reports. |
| **Clinical Supervisor** | `SUPERVISOR` / `ROLE_SUPERVISOR` | Supervisee clinical note approval queue, co-signatures, high-risk case oversight, and clinical audit reviews. |
| **Receptionist** | `RECEPTIONIST` / `ROLE_RECEPTIONIST` | Client registration, appointment booking, waiting room queue management, and insurance intake. |
| **Case Manager** | `CASE_MANAGER` / `ROLE_CASE_MANAGER` | Care coordination, social work linkages, external specialty referrals, and community resource management. |
| **Client / Patient** | `CLIENT` / `ROLE_CLIENT` | Patient portal: upcoming appointments, assigned treatment plans, self-assessment forms, safety plan access, and billing receipts. |

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.x (Java 17)
- **Security:** Spring Security 6 with JJWT (JSON Web Token)
- **Data Access:** Spring Data JPA with Hibernate ORM
- **Database:** MySQL 8.0+
- **JSON Processing:** Jackson FasterXML with custom serializing
- **Build Tool:** Apache Maven (includes Maven Wrapper `mvnw`)

### Frontend
- **Framework:** React 19 with Vite 8
- **Styling & UI:** Custom MindCare Design System (`mc-*`), Material UI (`@mui/material`), Lucide React icons
- **State & Routing:** React Context API (`AuthProvider`), React Router v6
- **HTTP Client:** Axios with JWT interceptors
- **Export Utility:** jsPDF for client treatment plan and clinical document generation

### Testing & QA
- **Backend Unit & Integration:** JUnit 5, Mockito, Spring Boot Test
- **Frontend Unit Tests:** Vitest, React Testing Library
- **End-to-End & UI Automation:** Selenium WebDriver with Google Chrome
- **Unit & Boundary Value Testing:** TestNG with Parameterized Suites
- **REST API Testing:** REST Assured & Postman Collection

---

## Project Structure

```
Mental-Health-Therapy-and-Session-Tracking-System/
├── mhtsts-backend/              # Spring Boot REST API
│   ├── src/main/java/com/mhtsts/
│   │   ├── config/              # SecurityConfig, MethodSecurityConfig, WebMvcConfig
│   │   ├── controller/          # REST Controllers for all clinical modules
│   │   ├── dto/                 # Request/Response Data Transfer Objects
│   │   ├── entity/              # JPA Database Entities (Users, Sessions, Notes, etc.)
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   ├── security/            # JwtUtil, JwtAuthenticationFilter, UserDetailsService
│   │   └── service/             # Business Logic & Service implementations
│   ├── src/main/resources/
│   │   ├── application.properties          # Base application configuration
│   │   └── application-example.properties  # Example configuration template
│   └── pom.xml                  # Maven Project Object Model
│
├── mhtsts-frontend/             # React 19 + Vite Web Application
│   ├── src/
│   │   ├── api/                 # Axios API service clients
│   │   ├── components/          # Reusable UI components & 8 role-specific sidebars
│   │   ├── config/              # Constants, role definitions, permission mappings
│   │   ├── features/            # Feature modules (auth, dashboard, therapist, etc.)
│   │   ├── providers/           # AuthProvider, ThemeProvider
│   │   ├── router/              # AppRouter with role-guarded routes
│   │   └── __tests__/           # Vitest test suites
│   ├── package.json             # NPM dependencies & scripts
│   └── vite.config.js           # Vite build configuration
│
├── postman/                     # API Testing Assets
│   ├── MHTSTS_Postman_Collection.json   # Full Postman API testing suite
│   ├── MHTSTS_Postman_Environment.json  # Environment variables configuration
│   └── README.md                        # Postman execution instructions
│
├── docs/                        # Architecture & Technical Documentation
│   ├── Bug_Fix_Report.md
│   ├── Deployment_Guide.md
│   ├── Final_Project_Report.md
│   ├── MHTSTS_API_Documentation.md
│   ├── Performance_Test_Report.md
│   ├── Security_Testing_Report.md
│   ├── System_Architecture_and_ER_Diagram.md
│   └── Testing_Documentation.md
│
├── tests/                       # Automated Testing Suite
│   ├── src/test/java/com/testing/
│   │   ├── api/                 # REST Assured automated endpoint tests
│   │   ├── selenium/            # Selenium WebDriver UI login & navigation tests
│   │   └── unit/                # TestNG Boundary Value Analysis unit tests
│   ├── src/test/resources/testng.xml
│   └── pom.xml                  # Standalone test runner dependencies
│
├── README.md                    # Root project documentation
└── .gitignore                   # Repository exclusion patterns
```

---

## Local Development & Setup

### Prerequisites
- **Java Development Kit (JDK):** Version 17 or higher
- **Node.js:** Version 18.x or higher and `npm`
- **MySQL Server:** Version 8.0 or higher
- **Web Browser:** Google Chrome (required for automated Selenium tests)

---

### Step 1: Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line) and create the database:
   ```sql
   CREATE DATABASE mhtsts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. The database schema and initial roles/seed accounts will automatically be generated upon first backend launch (`spring.jpa.hibernate.ddl-auto=update`).

---

### Step 2: Backend Setup (`mhtsts-backend`)
1. Navigate to the backend directory:
   ```bash
   cd mhtsts-backend
   ```
2. Configure database credentials:
   You can either supply environment variables:
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/mhtsts_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
   export DB_USERNAME="your_mysql_username"
   export DB_PASSWORD="your_mysql_password"
   ```
   Or update `src/main/resources/application.properties` (refer to `application-example.properties`).
3. Build and launch the Spring Boot service:
   ```bash
   # Windows
   mvnw.cmd spring-boot:run

   # macOS / Linux
   ./mvnw spring-boot:run
   ```
4. The backend API service will start on: **`http://localhost:8080`**

---

### Step 3: Frontend Setup (`mhtsts-frontend`)
1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd mhtsts-frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:5173`**

---

## Default Seed User Accounts

For testing and demonstration, the database seeds default user accounts for all 8 roles:

| Role | Username / Email | Default Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mindcare.com` | `admin123` | Administrator Management Console |
| **Therapist** | `therapist@mindcare.com` | `therapist123` | Clinical Therapist Workspace |
| **Psychiatrist** | `psychiatrist@mindcare.com`| `psychiatrist123`| Psychiatric Medical Workspace |
| **Psychologist** | `psychologist@mindcare.com`| `psychologist123`| Psychological Assessment Workspace |
| **Supervisor** | `supervisor@mindcare.com` | `supervisor123` | Supervision & Co-signature Console |
| **Receptionist** | `receptionist@mindcare.com`| `receptionist123`| Front Desk & Scheduling Console |
| **Case Manager** | `casemanager@mindcare.com` | `casemanager123` | Care Coordination & Referrals Desk |
| **Client** | `client@mindcare.com` | `client123` | Patient Portal |

---

## Running the Automated Test Suite

### 1. Backend Tests (Spring Boot & JUnit 5)
```bash
cd mhtsts-backend
./mvnw test
```

### 2. Frontend Unit Tests (Vitest)
```bash
cd mhtsts-frontend
npm test
```

### 3. Automated Selenium & TestNG Test Suite
Ensure both backend (`localhost:8080`) and frontend (`localhost:5173`) are running, then:
```bash
cd tests
mvn test
```
The test suite executes:
- **Boundary Value Analysis (BVA):** Validates clinical calculation boundaries and scores via TestNG.
- **REST Assured API Tests:** Validates authentication, JWT issuance, and API responses.
- **Selenium UI Tests:** Automates multi-role login, navigation, and dashboard verification in Google Chrome.

### 4. Postman API Collection
1. Launch Postman.
2. Click **Import** and select:
   - `postman/MHTSTS_Postman_Collection.json`
   - `postman/MHTSTS_Postman_Environment.json`
3. Select the **MindCare API Environment** and run requests across Auth, Appointments, Session Notes, Treatment Plans, and Billing endpoints.

---

## Security & Privacy Highlights

- **Zero Hardcoded Secrets:** Passwords and JWT secret keys are injected via configurable environment variables.
- **Data Segregation:** Client medical records and clinical notes are segregated using method-level security (`@PreAuthorize`) preventing unauthorized inter-role record access.
- **Input Validation:** Backend endpoints enforce standard Bean Validation (`@Valid`, `@NotNull`, `@Size`) preventing injection and malformed payloads.
- **CORS Configuration:** Configured to restrict cross-origin requests to authorized origins in production while enabling local development on `http://localhost:5173`.

---

## Documentation Index

For detailed architectural, deployment, and testing specifications, consult the documents in `/docs`:
- [System Architecture & ER Diagram](docs/System_Architecture_and_ER_Diagram.md)
- [MHTSTS API Documentation](docs/MHTSTS_API_Documentation.md)
- [Testing Documentation](docs/Testing_Documentation.md)
- [Deployment Guide](docs/Deployment_Guide.md)
- [Security Testing Report](docs/Security_Testing_Report.md)
- [Performance Test Report](docs/Performance_Test_Report.md)
- [Bug Fix Report](docs/Bug_Fix_Report.md)
- [Final Project Report](docs/Final_Project_Report.md)