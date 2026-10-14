-- Medical Support & Organ Platform Database Schema

CREATE DATABASE IF NOT EXISTS medical_platform;
USE medical_platform;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('DONOR', 'RECEIVER', 'HOSPITAL', 'ADMIN') NOT NULL DEFAULT 'DONOR',
  account_status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  address TEXT,
  contact VARCHAR(100),
  verification_status VARCHAR(50) DEFAULT 'APPROVED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medical Requests Table
CREATE TABLE IF NOT EXISTS medical_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  disease VARCHAR(255) NOT NULL,
  hospital VARCHAR(255) NOT NULL,
  treatment_required TEXT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  amount_received DECIMAL(12,2) DEFAULT 0.00,
  urgency ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') DEFAULT 'HIGH',
  status ENUM('PENDING', 'VERIFIED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'VERIFIED',
  verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  description TEXT,
  bank_name VARCHAR(150) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  ifsc_code VARCHAR(50) NOT NULL,
  beneficiary_name VARCHAR(255) NOT NULL,
  upi_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  request_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_reference VARCHAR(100) NOT NULL UNIQUE,
  payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
  donor_account_number VARCHAR(100),
  transaction_utr VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'SUCCESS',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Emergency Organ Requests Table
CREATE TABLE IF NOT EXISTS organ_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  hospital_id INT,
  hospital_name VARCHAR(255) NOT NULL,
  organ_type VARCHAR(100) NOT NULL,
  blood_type VARCHAR(20) NOT NULL,
  urgency ENUM('CRITICAL', 'HIGH', 'MEDIUM') DEFAULT 'HIGH',
  medical_summary TEXT,
  required_date DATE,
  status ENUM('PENDING', 'ACTIVE', 'MATCHED', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
  verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'VERIFIED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Verification Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  verification_status VARCHAR(50) DEFAULT 'VERIFIED',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
