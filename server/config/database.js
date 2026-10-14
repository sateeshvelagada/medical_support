const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool = null;
let isConnected = false;

// Realistic in-memory database store (fallback when MySQL is offline or initializing)
const inMemoryDB = {
  users: [],
  hospitals: [],
  medical_requests: [],
  donations: [],
  organ_requests: [],
  documents: [],
};

// Seed realistic data
async function seedRealisticData(target = 'memory') {
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  const seedUsers = [
    {
      id: 1,
      name: 'Arjun Sharma',
      email: 'donor@medicare.org',
      phone: '+91 98201 44521',
      password_hash: defaultPasswordHash,
      role: 'DONOR',
      account_status: 'ACTIVE',
      created_at: '2026-08-10 10:00:00',
    },
    {
      id: 2,
      name: 'Priya Mehta',
      email: 'receiver@medicare.org',
      phone: '+91 97112 88902',
      password_hash: defaultPasswordHash,
      role: 'RECEIVER',
      account_status: 'ACTIVE',
      created_at: '2026-08-15 11:30:00',
    },
    {
      id: 3,
      name: 'Apollo Hospital Authority',
      email: 'hospital@medicare.org',
      phone: '+91 22 2570 1200',
      password_hash: defaultPasswordHash,
      role: 'HOSPITAL',
      account_status: 'ACTIVE',
      created_at: '2026-07-01 09:00:00',
    },
    {
      id: 4,
      name: 'Platform Oversight Admin',
      email: 'admin@medicare.org',
      phone: '+91 11 2659 8700',
      password_hash: defaultPasswordHash,
      role: 'ADMIN',
      account_status: 'ACTIVE',
      created_at: '2026-06-01 08:00:00',
    },
  ];

  const seedHospitals = [
    {
      id: 1,
      user_id: 3,
      name: 'Apollo Hospital & Research Centre',
      registration_number: 'MAH-HOSP-2018-0914',
      address: 'Plot No. 13, Off Urban Express Highway, Mumbai, Maharashtra 400076',
      contact: '+91 22 2570 1200',
      verification_status: 'APPROVED',
      created_at: '2026-07-01 09:00:00',
    },
    {
      id: 2,
      user_id: null,
      name: 'Tata Memorial Centre (Advanced Cancer Care)',
      registration_number: 'MAH-ONCO-2012-0042',
      address: 'Dr. E Borges Road, Parel, Mumbai, Maharashtra 400012',
      contact: '+91 22 2417 7000',
      verification_status: 'APPROVED',
      created_at: '2026-07-05 10:00:00',
    },
    {
      id: 3,
      user_id: null,
      name: 'All India Institute of Medical Sciences (AIIMS)',
      registration_number: 'DEL-AIIMS-1956-0001',
      address: 'Ansari Nagar, New Delhi, Delhi 110029',
      contact: '+91 11 2658 8500',
      verification_status: 'APPROVED',
      created_at: '2026-07-10 10:00:00',
    },
  ];

  const seedRequests = [
    {
      id: 1,
      patient_id: 2,
      title: 'Pediatric Heart Surgery for Congenital Tetralogy of Fallot',
      disease: 'Tetralogy of Fallot (Cyanotic Congenital Heart Defect)',
      hospital: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
      treatment_required: 'Intracardiac Total Surgical Correction with CPB',
      total_amount: 850000.00,
      amount_received: 615000.00,
      urgency: 'CRITICAL',
      status: 'VERIFIED',
      verification_status: 'APPROVED',
      description: 'Aarav (4-year-old child) was diagnosed with severe cyanotic congenital heart defect. Oxygen saturation drops critically below 70% during mild exertion. Immediate surgical repair has been approved by the pediatric cardiology surgical board.',
      bank_name: 'State Bank of India',
      account_number: '309811452093',
      ifsc_code: 'SBIN0001536',
      beneficiary_name: 'AIIMS New Delhi Patient Escrow - Aarav Patel',
      upi_id: 'aiims.relief@sbi',
      created_at: '2026-09-12 14:20:00',
    },
    {
      id: 2,
      patient_id: 2,
      title: 'Urgent Stem Cell & Bone Marrow Transplant for Acute Leukemia',
      disease: 'Acute Myeloid Leukemia (AML - High Risk Cytogenetics)',
      hospital: 'Tata Memorial Centre, Parel, Mumbai',
      treatment_required: 'Allogeneic Hematopoietic Stem Cell Transplantation (HSCT)',
      total_amount: 1450000.00,
      amount_received: 780000.00,
      urgency: 'CRITICAL',
      status: 'VERIFIED',
      verification_status: 'APPROVED',
      description: 'Patient Priya (29 years) achieved morphological remission following aggressive induction chemotherapy. Transplant oncologist team recommends allogeneic BMT within 45 days to prevent fatal relapse. Escrow account managed directly by Tata Memorial accounts wing.',
      bank_name: 'Axis Bank Ltd',
      account_number: '92102004881920',
      ifsc_code: 'UTIB0000040',
      beneficiary_name: 'Tata Memorial Centre Escrow - Priya Mehta',
      upi_id: 'tmh.treatment@axisbank',
      created_at: '2026-09-18 16:45:00',
    },
    {
      id: 3,
      patient_id: 2,
      title: 'Deceased Donor Kidney Transplant & Immunosuppression Therapy',
      disease: 'End-Stage Renal Disease (ESRD - Hypertensive Nephropathy)',
      hospital: 'Apollo Hospital & Research Centre, Mumbai',
      treatment_required: 'Renal Allograft Transplantation & Induction Immunosuppression',
      total_amount: 950000.00,
      amount_received: 420000.00,
      urgency: 'HIGH',
      status: 'VERIFIED',
      verification_status: 'APPROVED',
      description: 'Patient undergoing tri-weekly maintenance hemodialysis for 18 months via arteriovenous fistula. Transplant authorization cleared by State Authorization Committee (ZCCK). Funds pay directly for donor organ harvest logistics and transplant surgery.',
      bank_name: 'HDFC Bank Ltd',
      account_number: '50100412893450',
      ifsc_code: 'HDFC0000004',
      beneficiary_name: 'Apollo Hospital Transplant Escrow - Rajesh Verma',
      upi_id: 'apollo.transplant@hdfcbank',
      created_at: '2026-09-24 09:15:00',
    },
    {
      id: 4,
      patient_id: 2,
      title: 'High-Risk Craniotomy & Awake Tumor Resection',
      disease: 'Left Fronto-Temporal Glioma (Grade III Astrocytoma)',
      hospital: 'Fortis Memorial Research Institute, Gurugram',
      treatment_required: 'Stereotactic Neuronavigation Guided Craniotomy & Post-Op Radiotherapy',
      total_amount: 720000.00,
      amount_received: 290000.00,
      urgency: 'HIGH',
      status: 'VERIFIED',
      verification_status: 'APPROVED',
      description: '19-year-old college student suffering from intractable focal motor seizures and progressive speech impediment. Immediate awake microneurosurgical debulking scheduled with intraoperative functional mapping.',
      bank_name: 'ICICI Bank Ltd',
      account_number: '002105018932',
      ifsc_code: 'ICIC0000021',
      beneficiary_name: 'FMRI Medical Relief Escrow - Meera Sen',
      upi_id: 'fmri.cases@icici',
      created_at: '2026-10-02 11:10:00',
    },
  ];

  const seedOrganRequests = [
    {
      id: 101,
      patient_id: 2,
      hospital_id: 1,
      hospital_name: 'Apollo Hospital & Research Centre, Mumbai',
      organ_type: 'Kidney',
      blood_type: 'B+',
      urgency: 'CRITICAL',
      medical_summary: 'End-Stage Renal Disease (ESRD). GFR < 8 mL/min. Dialysis access thrombosed. HLA cross-match pending suitable living or brain-dead deceased donor.',
      required_date: '2026-11-15',
      status: 'ACTIVE',
      verification_status: 'VERIFIED',
      created_at: '2026-10-01 10:00:00',
    },
    {
      id: 102,
      patient_id: 2,
      hospital_id: 2,
      hospital_name: 'Tata Memorial Centre, Mumbai',
      organ_type: 'Liver',
      blood_type: 'O+',
      urgency: 'CRITICAL',
      medical_summary: 'Acute Decompensated Liver Failure secondary to biliary atresia. MELD score 32 with severe portal hypertension. Rotational NOTTO national registry waitlist #14.',
      required_date: '2026-10-30',
      status: 'ACTIVE',
      verification_status: 'VERIFIED',
      created_at: '2026-10-04 12:30:00',
    },
    {
      id: 103,
      patient_id: 2,
      hospital_id: 3,
      hospital_name: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
      organ_type: 'Heart',
      blood_type: 'AB+',
      urgency: 'CRITICAL',
      medical_summary: 'End-Stage Dilated Cardiomyopathy with refractory NYHA Class IV heart failure. Left ventricular ejection fraction (LVEF) 18%. Dependent on continuous inotropic infusion.',
      required_date: '2026-11-05',
      status: 'ACTIVE',
      verification_status: 'VERIFIED',
      created_at: '2026-10-08 14:00:00',
    },
    {
      id: 104,
      patient_id: 2,
      hospital_id: 1,
      hospital_name: 'Apollo Hospital & Research Centre, Mumbai',
      organ_type: 'Cornea',
      blood_type: 'A+',
      urgency: 'HIGH',
      medical_summary: 'Traumatic bilateral alkali burn corneal vascularization. Requires optical penetrating keratoplasty to preserve bilateral vision.',
      required_date: '2026-12-01',
      status: 'ACTIVE',
      verification_status: 'VERIFIED',
      created_at: '2026-10-10 16:00:00',
    },
  ];

  const seedDonations = [
    {
      id: 1,
      donor_id: 1,
      request_id: 1,
      amount: 50000.00,
      payment_reference: 'TXN-MC-2026-88192',
      payment_method: 'BANK_TRANSFER',
      donor_account_number: '984022198421',
      transaction_utr: 'UTR882910394812',
      payment_status: 'SUCCESS',
      created_at: '2026-09-15 11:20:00',
    },
    {
      id: 2,
      donor_id: 1,
      request_id: 2,
      amount: 25000.00,
      payment_reference: 'TXN-MC-2026-99341',
      payment_method: 'UPI',
      donor_account_number: '984022198421',
      transaction_utr: 'UPI202610029381',
      payment_status: 'SUCCESS',
      created_at: '2026-09-22 17:40:00',
    },
  ];

  if (target === 'memory') {
    inMemoryDB.users = seedUsers;
    inMemoryDB.hospitals = seedHospitals;
    inMemoryDB.medical_requests = seedRequests;
    inMemoryDB.organ_requests = seedOrganRequests;
    inMemoryDB.donations = seedDonations;
    return;
  }

  // Insert into MySQL if empty
  if (target === 'mysql' && pool) {
    try {
      const [uRows] = await pool.query('SELECT COUNT(*) as cnt FROM users');
      if (uRows[0].cnt === 0) {
        for (const u of seedUsers) {
          await pool.query(
            'INSERT INTO users (id, name, email, phone, password_hash, role, account_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.account_status, u.created_at]
          );
        }
      }

      const [hRows] = await pool.query('SELECT COUNT(*) as cnt FROM hospitals');
      if (hRows[0].cnt === 0) {
        for (const h of seedHospitals) {
          await pool.query(
            'INSERT INTO hospitals (id, user_id, name, registration_number, address, contact, verification_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [h.id, h.user_id, h.name, h.registration_number, h.address, h.contact, h.verification_status, h.created_at]
          );
        }
      }

      const [rRows] = await pool.query('SELECT COUNT(*) as cnt FROM medical_requests');
      if (rRows[0].cnt === 0) {
        for (const r of seedRequests) {
          await pool.query(
            `INSERT INTO medical_requests 
             (id, patient_id, title, disease, hospital, treatment_required, total_amount, amount_received, urgency, status, verification_status, description, bank_name, account_number, ifsc_code, beneficiary_name, upi_id, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [r.id, r.patient_id, r.title, r.disease, r.hospital, r.treatment_required, r.total_amount, r.amount_received, r.urgency, r.status, r.verification_status, r.description, r.bank_name, r.account_number, r.ifsc_code, r.beneficiary_name, r.upi_id, r.created_at]
          );
        }
      }

      const [oRows] = await pool.query('SELECT COUNT(*) as cnt FROM organ_requests');
      if (oRows[0].cnt === 0) {
        for (const o of seedOrganRequests) {
          await pool.query(
            `INSERT INTO organ_requests 
             (id, patient_id, hospital_id, hospital_name, organ_type, blood_type, urgency, medical_summary, required_date, status, verification_status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [o.id, o.patient_id, o.hospital_id, o.hospital_name, o.organ_type, o.blood_type, o.urgency, o.medical_summary, o.required_date, o.status, o.verification_status, o.created_at]
          );
        }
      }

      const [dRows] = await pool.query('SELECT COUNT(*) as cnt FROM donations');
      if (dRows[0].cnt === 0) {
        for (const d of seedDonations) {
          await pool.query(
            `INSERT INTO donations 
             (id, donor_id, request_id, amount, payment_reference, payment_method, donor_account_number, transaction_utr, payment_status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [d.id, d.donor_id, d.request_id, d.amount, d.payment_reference, d.payment_method, d.donor_account_number, d.transaction_utr, d.payment_status, d.created_at]
          );
        }
      }
      console.log('✅ Real initial data seeded in MySQL database successfully');
    } catch (e) {
      console.error('Error seeding MySQL data:', e.message);
    }
  }
}

// Initial memory seeding
seedRealisticData('memory');

// Initialize database connection
const initDB = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const database = process.env.DB_NAME || 'medical_platform';

  try {
    // Step 1: Connect to server without database to create DB if needed
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await rootConn.end();

    // Step 2: Create connection pool with the database
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Step 3: Run table creations
    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        document_name VARCHAR(255) NOT NULL,
        verification_status VARCHAR(50) DEFAULT 'VERIFIED',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    isConnected = true;
    console.log(`✅ MySQL connected & verified database: ${database}`);

    // Seed realistic records in MySQL
    await seedRealisticData('mysql');

  } catch (err) {
    isConnected = false;
    console.error('❌ MySQL connection failed:', err.message);
    console.log('ℹ️  Running in realistic prototype mode (all CRUD operations active). Set DB credentials in server/.env anytime.');
  }
};

// Safe DB query wrapper that switches between MySQL and In-Memory seamlessly
const db = {
  isMySQL: () => isConnected,

  async query(sql, params = []) {
    if (isConnected && pool) {
      try {
        const [rows] = await pool.query(sql, params);
        return rows;
      } catch (err) {
        console.error('MySQL query error, fallback to memory:', err.message);
      }
    }
    return null;
  },

  getMemoryDB: () => inMemoryDB,
};

module.exports = { initDB, db, inMemoryDB };
