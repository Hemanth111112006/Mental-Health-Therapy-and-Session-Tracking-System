# MHTSTS Testing Documentation

## 1. Testing Frameworks & Strategy

MHTSTS employs a multi-tiered testing strategy ensuring reliability across the stack:

| Layer | Framework / Tool | Scope |
|---|---|---|
| **Backend Unit & Integration** | JUnit 5, Mockito, Spring Boot Test | Controllers, Services, Repositories, Spring Security JWT |
| **Frontend Unit & Component** | Vitest, React Testing Library | Component render, form validation, role-based guard routing |
| **End-to-End UI Automation** | Selenium WebDriver, WebDriverManager | Chrome browser automation, authentication, dashboard navigation |
| **Test Suite & BVA** | TestNG | Boundary value analysis, DataProviders, XML suite runner |
| **API Integration** | REST Assured, Postman | HTTP status codes, Bearer token challenges, CRUD operations |

---

## 2. Backend Tests (`mhtsts-backend/src/test/`)

- `AuthenticationControllerTest.java`: Tests `/api/auth/login` and `/api/auth/register` endpoints.
- `ClientControllerTest.java`: Verifies patient record retrieval, filtering, and role protection.
- `ClientRepositoryTest.java`: JPA repository queries, custom finders, and database operations.
- `AuthServiceTest.java`: Password hashing, token generation, user validation.
- `AppointmentServiceTest.java`: Conflict detection, status lifecycle transitions.
- `ClientServiceTest.java`: Business validations, client number generation.
- `SafetyPlanServiceTest.java`: Suicide risk assessment and emergency contact mapping.
- `SessionNoteServiceTest.java`: SOAP/DAP/BIRP note signing and co-signature workflow.

---

## 3. UI Automation & Regression Tests (`tests/`)

- `CalculatorTest.java`: Demonstrates Boundary Value Analysis (BVA) and Equivalence Class Partitioning (ECP) with TestNG `@DataProvider`.
- `LoginAutomationTest.java`: Selenium WebDriver automated test running against live application:
  - Verifies page loading and DOM elements.
  - Negative testing (invalid credentials rejected).
  - Positive testing: Authenticates as Administrator and confirms landing on `http://localhost:5173/admin/dashboard`.
- `MindCareApiTest.java`: REST Assured automated verification of backend connectivity and JWT security enforcement.
