# MHTSTS Postman API Collection & Environment

This directory contains the official Postman API collection and environment configuration for the **Mental Health Therapy and Session Tracking System (MHTSTS)**.

---

## 📁 Files Included

- **`MHTSTS_Postman_Collection.json`**: Complete collection of REST API requests covering Authentication, Clients, Appointments, Clinical Notes, Treatment Plans, Outcome Measures, Crisis Assessments, Safety Plans, Billing, and Admin operations.
- **`MHTSTS_Postman_Environment.json`**: Environment variables configuring `base_url` (`http://localhost:8080/api`), auth tokens, and entity IDs.

---

## 🚀 How to Import and Run in Postman

1. Open **Postman**.
2. Click **Import** in the top left.
3. Drag & drop or select both:
   - `MHTSTS_Postman_Collection.json`
   - `MHTSTS_Postman_Environment.json`
4. In the top-right environment dropdown, select **`MHTSTS Environment`**.
5. Execute the **Login** request first to obtain a JWT Bearer token.
6. The test script will automatically save the token to the `token` environment variable for all subsequent requests.
