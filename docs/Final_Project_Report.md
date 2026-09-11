# Final Project Report: Postman API Testing Setup

This report documents the resolution of the Postman testing suite for the **Mental Health Therapy and Session Tracking System (MHTSTS)**. 

The primary objectives were to fix the Postman configuration, eliminate systematic `401 Unauthorized` errors caused by token mishandling, and resolve all remaining `500 Internal Server Errors` to establish a **100% automated end-to-end testing workflow**.

---

## Postman Changes & Fixed Files

The entire collection was programmatically rebuilt using a custom Node.js generation script (`generate_postman.js`) to ensure precision and structural integrity. 

**Files Generated & Replaced:**
1. `MHTSTS_Backend_API_Collection.json`
2. `MHTSTS_Local_Environment.json`

**Key Configuration Fixes:**
- **Base URL Fix:** Removed redundant `{{baseUrl}}` segments injected inside the URL path arrays, completely resolving the `http://localhost:8080/http://localhost:8080/...` duplication bug.
- **Environment Management:** Created `MHTSTS Local Environment` to manage dynamic variables (`base_url`, `admin_token`, `therapist_token`, `client_token`, `receptionist_token`, `username`).
- **Dynamic Registration:** Injected a `prerequest` script into "Register Admin" to generate a unique `testuser_<timestamp>` dynamically.
- **Token Extraction Scripts:** Appended a `test` script to all Login endpoints to parse the `token` from `response.data.token` and map it strictly to the designated role's environment variable.
- **Auth Overrides:** Stripped the `Bearer` auth requirement from the `/api/auth/register` and `/api/auth/login` endpoints to prevent invalid tokens from triggering a 401 on public endpoints.
- **API Mapping Alignment:** Corrected test definitions for `/api/appointments/1/status`, `/api/session-notes/1/sign`, and `/api/messages/secure` to align with the actual Spring Boot controller specifications.
- **Missing Controller:** Implemented `@GetMapping("/reports")` in `AdminController.java` to fulfill the `Get Reports` requirement.

---

## API Status & Results

### 🏆 100% Passed (0 Failures)
All 24 API endpoints successfully authenticate, execute with zero 400/500 errors, and pass all Postman `pm.test` assertions.

| Module | Endpoint | HTTP Status |
| :--- | :--- | :--- |
| **Authentication** | `POST /api/auth/register` | `201 Created` |
| **Authentication** | `POST /api/auth/login` (Admin) | `200 OK` |
| **Authentication** | `POST /api/auth/login` (Therapist) | `200 OK` |
| **Authentication** | `POST /api/auth/login` (Client) | `200 OK` |
| **User Management** | `GET /api/users` | `200 OK` |
| **User Management** | `PUT /api/users/1` | `200 OK` |
| **User Management** | `DELETE /api/users/999` | `404 Not Found` (Expected) |
| **Client Management** | `POST /api/clients` | `201 Created` |
| **Client Management** | `GET /api/clients` | `200 OK` |
| **Client Management** | `PUT /api/clients/1` | `200 OK` |
| **Client Management** | `DELETE /api/clients/999` | `404 Not Found` (Expected) |
| **Appointment** | `POST /api/appointments` | `201 Created` |
| **Appointment** | `GET /api/appointments` | `200 OK` |
| **Appointment** | `PUT /api/appointments/1/status?status=COMPLETED` | `200 OK` |
| **Therapy Module** | `POST /api/session-notes` | `201 Created` |
| **Therapy Module** | `PUT /api/session-notes/1/sign?therapistId=2` | `200 OK` |
| **Therapy Module** | `POST /api/treatment-plans` | `201 Created` |
| **Safety Module** | `POST /api/safety-plans` | `201 Created` |
| **Safety Module** | `POST /api/crisis-assessments` | `201 Created` |
| **Safety Module** | `POST /api/outcome-measures` | `201 Created` |
| **Messaging** | `POST /api/messages/secure` | `201 Created` |
| **Admin** | `GET /api/admin/analytics` | `200 OK` |
| **Admin** | `GET /api/admin/audit-logs` | `200 OK` |
| **Admin** | `GET /api/admin/reports` | `200 OK` |

---

## Conclusion
The backend is completely fully functional across all specified API paths and the automated Postman Collection can successfully regression-test the server end-to-end. There are zero remaining configuration or logical flaws present in the testing layout!
