# Mental Health Therapy and Session Tracking System (MHTSTS)
## Production Deployment & System Environment Setup Guide

---

### **1. Prerequisites & Runtime Requirements**

#### **1.1 Server Infrastructure Requirements**:
- **Operating System**: Linux (Ubuntu 22.04 LTS recommended) or Windows Server 2022
- **Java Runtime**: OpenJDK 17 or Oracle JDK 17+
- **Database**: PostgreSQL 16 Enterprise Server
- **Node.js Environment**: Node.js v20+ & npm v10+
- **Memory**: Minimum 4 GB RAM (8 GB recommended for production)
- **Disk Space**: Minimum 20 GB SSD storage

---

### **2. Database Provisioning (PostgreSQL 16)**

1. **Create Database & Service Role**:
```sql
CREATE DATABASE mhtsts_db;
CREATE USER mhtsts_admin WITH ENCRYPTED PASSWORD 'MhtstsSecurePass2026!';
GRANT ALL PRIVILEGES ON DATABASE mhtsts_db TO mhtsts_admin;
```

2. **Schema & Table Initialization**:
   - The Spring Boot backend automatically provisions all 12 tables upon first startup via Hibernate DDL:
     `spring.jpa.hibernate.ddl-auto=update`

---

### **3. Backend Production Deployment (Spring Boot 3.x)**

1. **Build Production Executable JAR**:
```bash
cd /path/to/mhtsts-backend
./mvnw clean package -DskipTests
```
*Output Artifact*: `target/mhtsts-backend-0.0.1-SNAPSHOT.jar`

2. **Production Environment Configuration (`application-prod.properties`)**:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/mhtsts_db
spring.datasource.username=mhtsts_admin
spring.datasource.password=MhtstsSecurePass2026!
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT Secret Key (256-bit Minimum)
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

3. **Start Backend Service as SystemDaemon (Linux `systemd`)**:
```bash
java -jar -Dspring.profiles.active=prod target/mhtsts-backend-0.0.1-SNAPSHOT.jar
```

---

### **4. Frontend Production Deployment (React.js + Vite)**

1. **Build Static Distribution**:
```bash
cd /path/to/mhtsts-frontend
npm install
npm run build
```
*Output Bundle*: `dist/` (Contains `index.html`, JavaScript chunks, CSS styles)

2. **Deploy via Nginx Web Server (`/etc/nginx/sites-available/mhtsts`)**:
```nginx
server {
    listen 80;
    server_name mhtsts.mindcare.com;

    root /var/www/mhtsts-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### **5. Health Verification Checklist**

- [x] PostgreSQL Service running on port `5432`
- [x] Spring Boot REST API responding to `http://localhost:8080/api/auth/login`
- [x] Nginx Web Server proxying frontend requests on port `80` / `443`
- [x] JWT Bearer Token validation and RBAC guards active
