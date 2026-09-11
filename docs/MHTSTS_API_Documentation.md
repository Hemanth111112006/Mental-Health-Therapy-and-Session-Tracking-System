# Mental Health Therapy and Session Tracking System (MHTSTS)
## Comprehensive REST API Documentation & Specification

---

### **Overview**
This specification provides complete technical documentation for all REST API endpoints implemented in the **Mental Health Therapy and Session Tracking System (MHTSTS)**.

- **Base URL**: `http://localhost:8080`
- **Authentication**: JWT Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)
- **Response Wrapper Format**: `ApiResponse<T>`
- **Security Standard**: Spring Security 6 + Role-Based Access Control (RBAC)

---

### **1. Authentication APIs (`/api/auth`)**

#### **1.1 Register User**
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth**: Public (Unauthenticated)
- **Request Parameters**: `password` (e.g. `therapistPass123`)
- **Request Body**:
```json
{
  "username": "dr_smith",
  "email": "smith@mindcare.com",
  "role": "THERAPIST",
  "status": "ACTIVE"
}
```
- **Response (`201 CREATED`)**:
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "dr_smith",
    "role": "THERAPIST",
    "expirationTime": "2026-08-10T04:30:00.000+00:00"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

#### **1.2 User Login**
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth**: Public (Unauthenticated)
- **Request Body**:
```json
{
  "username": "dr_smith",
  "password": "therapistPass123"
}
```
- **Response (`200 OK`)**:
```json
{
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "dr_smith",
    "role": "THERAPIST",
    "expirationTime": "2026-08-10T04:30:00.000+00:00"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

---

### **2. User APIs (`/api/users`)**

#### **2.1 Get All Users**
- **Method**: `GET`
- **URL**: `/api/users`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>` (Roles: `ADMIN`)
- **Response (`200 OK`)**:
```json
[
  {
    "id": 1,
    "username": "dr_smith",
    "email": "smith@mindcare.com",
    "role": "THERAPIST",
    "status": "ACTIVE"
  }
]
```

---

### **3. Client APIs (`/api/clients`)**

#### **3.1 Create Client Intake**
- **Method**: `POST`
- **URL**: `/api/clients`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
```json
{
  "clientNumber": "CLI-1001",
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "phoneNumber": "9876543210",
  "email": "john@gmail.com",
  "emergencyContactName": "Jane Smith",
  "emergencyContactPhone": "9876543211",
  "status": "ACTIVE"
}
```
- **Response (`201 CREATED`)**:
```json
{
  "message": "Client created successfully",
  "data": {
    "id": 1,
    "clientNumber": "CLI-1001",
    "firstName": "John",
    "lastName": "Smith",
    "status": "ACTIVE"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

---

### **4. Appointment APIs (`/api/appointments`)**

#### **4.1 Create Appointment**
- **Method**: `POST`
- **URL**: `/api/appointments`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
```json
{
  "appointmentDate": "2026-08-15",
  "startTime": "10:00:00",
  "duration": 50,
  "sessionType": "INDIVIDUAL_THERAPY",
  "modality": "TELEHEALTH",
  "status": "SCHEDULED",
  "cptCode": "90834"
}
```
- **Response (`201 CREATED`)**:
```json
{
  "message": "Appointment created successfully",
  "data": {
    "id": 1,
    "appointmentDate": "2026-08-15",
    "startTime": "10:00:00",
    "status": "SCHEDULED"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

---

### **5. Clinical Module APIs (`/api/session-notes`, `/api/safety-plans`, `/api/crisis-assessments`, `/api/outcome-measures`)**

#### **5.1 Log Session Note**
- **Method**: `POST`
- **URL**: `/api/session-notes`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>` (Roles: `THERAPIST`, `PSYCHIATRIST`, `PSYCHOLOGIST`, `SUPERVISOR`)
- **Request Body**:
```json
{
  "noteType": "SOAP",
  "noteContent": "Subjective: Client reports anxiety reduction. Objective: Calmer affect. Assessment: Progressing nicely. Plan: Continue weekly CBT.",
  "diagnosis": "F41.1 GAD",
  "cptCode": "90834",
  "sessionDuration": 50,
  "isLate": false
}
```
- **Response (`201 CREATED`)**:
```json
{
  "message": "Session note created successfully",
  "data": {
    "id": 1,
    "noteType": "SOAP",
    "diagnosis": "F41.1 GAD"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

---

### **6. Admin APIs (`/api/admin`)**

#### **6.1 Get Practice Analytics**
- **Method**: `GET`
- **URL**: `/api/admin/analytics`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>` (Roles: `ADMIN` only)
- **Response (`200 OK`)**:
```json
{
  "message": "Analytics metrics retrieved",
  "data": {
    "totalSessions": 1240,
    "clientGrowth": "+14.2%",
    "appointmentStats": "94% Completion Rate"
  },
  "timestamp": "2026-08-09T21:35:00"
}
```

---

### **7. Error & Security Status Responses**

| Status Code | Description | Example Condition |
| :---: | :--- | :--- |
| `400 BAD_REQUEST` | Validation error on payload inputs. | Invalid email format or phone length != 10. |
| `401 UNAUTHORIZED` | Missing or expired JWT Bearer token. | Calling protected API without `Authorization` header. |
| `403 FORBIDDEN` | Authenticated user lacks required RBAC role. | `CLIENT` attempting to access `/api/admin/analytics`. |
| `404 NOT_FOUND` | Resource ID does not exist in DB. | Requesting `GET /api/clients/99999`. |
| `500 INTERNAL_SERVER_ERROR` | Internal server or DB transaction error. | SQL constraint violation or unhandled runtime failure. |
