# MHTSTS System Architecture & ER Diagram

## 1. System Architecture Overview

The **Mental Health Therapy and Session Tracking System (MHTSTS)** is built following a modular 3-tier architecture:

```
[ Client Layer ]             React 19 + Vite SPA (TypeScript / JSX)
        │                     MUI, Bootstrap, Lucide React, Recharts, jsPDF
        ▼ HTTP/JSON (REST)
[ Application Layer ]        Spring Boot 3.2.3 Backend
        │                     Spring Security 6, JJWT (v0.12.5), Spring Data JPA
        │                     Role-Based Access Control (RBAC), Global Exception Handler
        ▼ JDBC (MySQL Driver)
[ Persistence Layer ]        MySQL 8.0 Relational Database (E2EE at rest)
```

---

## 2. Role-Based Access Control (RBAC) Architecture

MHTSTS enforces strict HIPAA-compliant separation of duties across 8 distinct user roles:

| Role | Access Scope | Permissions & Views |
|---|---|---|
| **ADMIN** | System-wide administrative | User management, RBAC, audit logs, clearinghouse billing, system config |
| **THERAPIST** | Assigned clinical caseload | Case notes (SOAP/DAP/BIRP), treatment plans, outcome measures, crisis assessments, appointments |
| **PSYCHIATRIST** | Medical & pharmacotherapy | Psychiatric consultations, medication reviews, electronic prescriptions, high-risk alerts |
| **PSYCHOLOGIST** | Psychological assessment | Assessment batteries (PHQ-9, GAD-7, MMPI-3), psych evaluations, diagnostic reporting |
| **SUPERVISOR** | Clinical oversight | Note co-signatures, clinician caseload monitoring, supervisee reviews, performance analytics |
| **RECEPTIONIST** | Front desk operations | Patient check-ins, waiting room queue, appointment booking, insurance verification |
| **CASE_MANAGER** | Social services & care coordination | Care plans, referrals, community resource linking, follow-up management |
| **CLIENT** | Patient Portal | Personal appointment schedule, itemized billing statements/receipts, treatment plan, safety plan |

---

## 3. Entity-Relationship (ER) Model

```
                    ┌─────────────────┐
                    │      USERS      │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ email (Unique)  │
                    │ password (Hash) │
                    │ role (Enum)     │
                    │ first_name      │
                    │ last_name       │
                    └────────┬────────┘
                             │ 1
                             │
                             │ * assigned
                    ┌────────┴────────┐
                    │     CLIENTS     │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ client_number   │
                    │ first_name      │
                    │ last_name       │
                    │ date_of_birth   │
                    │ phone           │
                    │ insurance_info  │
                    └────────┬────────┘
                             │
       ┌─────────────────────┼─────────────────────┬─────────────────────┐
       │ 1                   │ 1                   │ 1                   │ 1
       │ *                   │ *                   │ *                   │ *
┌──────┴───────┐      ┌──────┴───────┐      ┌──────┴───────┐      ┌──────┴───────┐
│ APPOINTMENTS │      │ SESSION_NOTES│      │TREATMENT_PLAN│      │   INVOICES   │
├──────────────┤      ├──────────────┤      ├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
│ client_id(FK)│      │ client_id(FK)│      │ client_id(FK)│      │ client_id(FK)│
│ therapist_id │      │ author_id(FK)│      │ provider_id  │      │ invoice_num  │
│ start_time   │      │ note_type    │      │ diagnosis    │      │ billed_amount│
│ end_time     │      │ content      │      │ goals        │      │ insurance_pd │
│ type         │      │ icd_code     │      │ review_date  │      │ client_resp  │
│ status       │      │ signed       │      │ status       │      │ status       │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```
