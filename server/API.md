# RentEase API Documentation

Indian Apartment Rental Management System — REST API

**Base URL:** `http://localhost:5000/api`

**Authentication:** Bearer JWT token in header:
```
Authorization: Bearer <token>
```

---

## Health Check

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/health` | Public |

---

## Authentication

### Admin Login
`POST /api/admin/login`

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": { "id": "...", "username": "admin", "role": "admin" }
  }
}
```

### Tenant Login
`POST /api/tenant/login`

```json
{
  "flatNumber": "101",
  "password": "tenant123"
}
```

---

## Admin APIs (Requires `admin` role)

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Statistics: apartments, floors, rooms, tenants, complaints, monthly revenue (INR) |

### Apartments
| Method | Endpoint |
|--------|----------|
| GET | `/api/apartments` |
| POST | `/api/apartments` |
| PUT | `/api/apartments/:id` |
| DELETE | `/api/apartments/:id` |

**Create body:**
```json
{
  "apartmentName": "Sri Lakshmi Residency",
  "address": "Plot No. 45, Madhapur, Hyderabad - 500081",
  "city": "Hyderabad",
  "totalFloors": 3,
  "image": "https://..."
}
```

### Floors
| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/api/floors` | `?apartmentId=` |
| POST | `/api/floors` | |
| PUT | `/api/floors/:id` | |
| DELETE | `/api/floors/:id` | |

**Create body:**
```json
{ "apartmentId": "mongoId", "floorNumber": 1 }
```

### Rooms / Flats
| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/api/rooms` | `?apartmentId=&floorNumber=&status=` |
| POST | `/api/rooms` | |
| PUT | `/api/rooms/:id` | |
| DELETE | `/api/rooms/:id` | |
| PATCH | `/api/rooms/:id/status` | |

**Status patch body:**
```json
{ "status": "Occupied" }
```
Values: `Occupied` | `Vacant`

### Tenants / Residents
| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/api/tenants` | `?apartmentId=&search=` |
| POST | `/api/tenants` | |
| PUT | `/api/tenants/:id` | |
| DELETE | `/api/tenants/:id` | |

**Create body:**
```json
{
  "flatNumber": "101",
  "tenantName": "Ravi Kumar",
  "mobileNumber": "+91 9876543210",
  "apartmentId": "mongoId",
  "floorNumber": 1,
  "password": "tenant123"
}
```

### Bills
| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/api/bills` | `?apartmentId=&tenantId=&month=&year=&paymentStatus=` |
| POST | `/api/bills` | |
| PUT | `/api/bills/:id` | |
| DELETE | `/api/bills/:id` | |

**Create body:**
```json
{
  "tenantId": "mongoId",
  "apartmentId": "mongoId",
  "roomNumber": "101",
  "month": 6,
  "year": 2026,
  "rentAmount": 12000,
  "electricityBill": 1850,
  "waterBill": 450,
  "maintenanceBill": 1200,
  "generatorCharges": 500,
  "paymentStatus": "Pending"
}
```
Payment status: `Pending` | `Paid` | `Overdue`

### Complaints
| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/api/complaints` | `?status=&apartmentId=` |
| PATCH | `/api/complaints/:id/status` | |

**Status patch:**
```json
{ "status": "In Progress" }
```
Values: `Pending` | `In Progress` | `Completed`

### Notifications
| Method | Endpoint |
|--------|----------|
| GET | `/api/notifications` |
| PATCH | `/api/notifications/:id/read` |
| PATCH | `/api/notifications/read-all` |

---

## Tenant APIs (Requires `tenant` role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tenant/profile` | Resident profile + apartment |
| GET | `/api/tenant/bills` | Own bills |
| GET | `/api/tenant/complaints` | Own complaints |
| POST | `/api/tenant/complaints` | Submit complaint (multipart) |
| GET | `/api/tenant/notifications` | Notifications |

### Submit Complaint (multipart/form-data)
| Field | Type | Required |
|-------|------|----------|
| complaintType | string | Yes |
| description | string | Yes |
| image | file | No |

**Complaint types:**
- Water Leakage
- Power Issue
- Lift Problem
- Drainage Issue
- Security Complaint
- Cleaning Request

---

## Error Response Format

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description"
}
```

| Code | Meaning |
|------|---------|
| 400 | Validation / bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

---

## Setup & Run

```bash
cd server
npm install
npm run seed    # Seed Indian sample data
npm run dev     # Development with watch
npm start       # Production
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/rentease
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Seed Credentials
| Role | Credentials |
|------|-------------|
| Admin | `admin` / `admin123` |
| Tenant | Flat `101` / `tenant123` |
