# MediCare Connect — Medical Assistance & Emergency Organ Support Prototype

A secure, verified healthcare support and emergency organ-matching prototype platform built with React and Express.

---

## 🌟 Key Features

1. **Role-Based Access & Instant Demo Logins**:
   - **Donor**: Browse verified patient requests, make contributions, track donation history and life impact.
   - **Receiver / Patient**: Create medical assistance requests, submit hospital & medical verification, create emergency organ support requests.
   - **Hospital**: Verify patient admissions, monitor emergency organ matching lists, update match/transplant status.
   - **Administrator**: Verify medical funding requests, validate patient documents, manage hospital registrations and user accounts.

2. **Verified Medical Assistance Campaigns**:
   - Category filtering (Cancer, Surgery, Cardiac, Pediatrics, etc.)
   - Real-time funding progress bars and urgency indicators (Critical, High, Medium)
   - Transparent verification badges and hospital affiliations

3. **Emergency Organ-Support Module**:
   - Organ-type and blood-group matching (Kidney, Liver, Heart, Cornea, Bone Marrow, etc.)
   - High-priority urgency alerts for ICU/Critical stage patients
   - Authorized hospital verification and coordination status

---

## 🚀 How to Run the Prototype

### 1. Client (Frontend)
```bash
npm run client
# or: cd client && npm run dev
```
Visit: **`http://localhost:5173/`**

### 2. Server (Backend API)
```bash
npm run server
# or: cd server && npm run dev
```
Runs at: **`http://localhost:5000/`** (equipped with fallback prototype mode when local MySQL is not configured).

---

## 👥 Demo Accounts (Instant 1-Click Login on `/login`)
- **Donor**: `donor@demo.com`
- **Patient/Receiver**: `receiver@demo.com`
- **Hospital**: `hospital@demo.com`
- **Administrator**: `admin@demo.com`
