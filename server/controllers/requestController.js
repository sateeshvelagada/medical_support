const { db, inMemoryDB } = require('../config/database');

// GET /api/requests/verified — public & donors
const getVerifiedRequests = async (req, res, next) => {
  try {
    let requests = [];

    if (db.isMySQL()) {
      const rows = await db.query(
        `SELECT id, patient_id, title, disease, hospital, treatment_required, 
                total_amount, amount_received, urgency, status, verification_status, 
                description, bank_name, account_number, ifsc_code, beneficiary_name, upi_id, created_at 
         FROM medical_requests 
         WHERE verification_status = 'APPROVED' OR status IN ('VERIFIED', 'ACTIVE')
         ORDER BY id DESC`
      );
      requests = rows || [];
    } else {
      requests = inMemoryDB.medical_requests.filter(
        r => r.verification_status === 'APPROVED' || r.status === 'VERIFIED' || r.status === 'ACTIVE'
      );
    }

    // Format fields consistently
    const formatted = requests.map(r => ({
      id: r.id,
      patientId: r.patient_id,
      title: r.title,
      disease: r.disease,
      hospital: r.hospital,
      treatmentRequired: r.treatment_required,
      totalAmount: parseFloat(r.total_amount),
      amountReceived: parseFloat(r.amount_received || 0),
      urgency: r.urgency,
      status: r.status,
      verificationStatus: r.verification_status,
      description: r.description,
      // Official Escrow Bank Details for Donor Payment
      bankName: r.bank_name,
      accountNumber: r.account_number,
      ifscCode: r.ifsc_code,
      beneficiaryName: r.beneficiary_name,
      upiId: r.upi_id,
      createdAt: r.created_at,
    }));

    res.json({ requests: formatted, count: formatted.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    let request = null;

    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM medical_requests WHERE id = ?', [id]);
      if (rows && rows.length > 0) request = rows[0];
    } else {
      request = inMemoryDB.medical_requests.find(r => r.id === id);
    }

    if (!request) {
      return res.status(404).json({ error: 'Medical request not found' });
    }

    res.json({
      request: {
        id: request.id,
        patientId: request.patient_id,
        title: request.title,
        disease: request.disease,
        hospital: request.hospital,
        treatmentRequired: request.treatment_required,
        totalAmount: parseFloat(request.total_amount),
        amountReceived: parseFloat(request.amount_received || 0),
        urgency: request.urgency,
        status: request.status,
        verificationStatus: request.verification_status,
        description: request.description,
        bankName: request.bank_name,
        accountNumber: request.account_number,
        ifscCode: request.ifsc_code,
        beneficiaryName: request.beneficiary_name,
        upiId: request.upi_id,
        createdAt: request.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/requests — receiver creates a request with verified bank details
const createRequest = async (req, res, next) => {
  try {
    const {
      title,
      disease,
      hospital,
      treatmentRequired,
      totalAmount,
      urgency,
      description,
      bankName,
      accountNumber,
      ifscCode,
      beneficiaryName,
      upiId,
    } = req.body;

    const patientId = req.user.id;

    if (!title || !disease || !hospital || !totalAmount) {
      return res.status(400).json({ error: 'Title, disease, hospital, and total amount are required' });
    }

    const defaultBank = bankName || 'State Bank of India (Medical Escrow)';
    const defaultAcc = accountNumber || `3098${Math.floor(10000000 + Math.random() * 90000000)}`;
    const defaultIfsc = ifscCode || 'SBIN0001536';
    const defaultBene = beneficiaryName || `${hospital} - Escrow Account (${req.user.name || 'Patient'})`;
    const defaultUpi = upiId || `medicare.${Date.now().toString().slice(-6)}@sbi`;

    if (db.isMySQL()) {
      const result = await db.query(
        `INSERT INTO medical_requests 
         (patient_id, title, disease, hospital, treatment_required, total_amount, amount_received, urgency, status, verification_status, description, bank_name, account_number, ifsc_code, beneficiary_name, upi_id)
         VALUES (?, ?, ?, ?, ?, ?, 0.00, ?, 'PENDING', 'PENDING', ?, ?, ?, ?, ?, ?)`,
        [
          patientId,
          title,
          disease,
          hospital,
          treatmentRequired || 'Medical care',
          parseFloat(totalAmount),
          urgency || 'HIGH',
          description || '',
          defaultBank,
          defaultAcc,
          defaultIfsc,
          defaultBene,
          defaultUpi,
        ]
      );

      return res.status(201).json({
        message: 'Medical assistance request submitted for hospital verification',
        requestId: result.insertId,
      });
    } else {
      const newReq = {
        id: Date.now(),
        patient_id: patientId,
        title,
        disease,
        hospital,
        treatment_required: treatmentRequired || 'Medical care',
        total_amount: parseFloat(totalAmount),
        amount_received: 0.00,
        urgency: urgency || 'HIGH',
        status: 'PENDING',
        verification_status: 'PENDING',
        description: description || '',
        bank_name: defaultBank,
        account_number: defaultAcc,
        ifsc_code: defaultIfsc,
        beneficiary_name: defaultBene,
        upi_id: defaultUpi,
        created_at: new Date().toISOString(),
      };

      inMemoryDB.medical_requests.unshift(newReq);
      return res.status(201).json({
        message: 'Medical assistance request submitted for hospital verification',
        request: newReq,
      });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/my — receiver's own requests
const getMyRequests = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    let requests = [];

    if (db.isMySQL()) {
      const rows = await db.query(
        'SELECT * FROM medical_requests WHERE patient_id = ? ORDER BY id DESC',
        [patientId]
      );
      requests = rows || [];
    } else {
      requests = inMemoryDB.medical_requests.filter(r => r.patient_id === patientId);
    }

    const formatted = requests.map(r => ({
      id: r.id,
      title: r.title,
      disease: r.disease,
      hospital: r.hospital,
      treatmentRequired: r.treatment_required,
      totalAmount: parseFloat(r.total_amount),
      amountReceived: parseFloat(r.amount_received || 0),
      urgency: r.urgency,
      status: r.status,
      verificationStatus: r.verification_status,
      description: r.description,
      bankName: r.bank_name,
      accountNumber: r.account_number,
      ifscCode: r.ifsc_code,
      beneficiaryName: r.beneficiary_name,
      upiId: r.upi_id,
      createdAt: r.created_at,
    }));

    res.json({ requests: formatted });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/all — admin
const getAllRequests = async (req, res, next) => {
  try {
    let requests = [];

    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM medical_requests ORDER BY id DESC');
      requests = rows || [];
    } else {
      requests = inMemoryDB.medical_requests;
    }

    const formatted = requests.map(r => ({
      id: r.id,
      patientId: r.patient_id,
      title: r.title,
      disease: r.disease,
      hospital: r.hospital,
      treatmentRequired: r.treatment_required,
      totalAmount: parseFloat(r.total_amount),
      amountReceived: parseFloat(r.amount_received || 0),
      urgency: r.urgency,
      status: r.status,
      verificationStatus: r.verification_status,
      description: r.description,
      bankName: r.bank_name,
      accountNumber: r.account_number,
      ifscCode: r.ifsc_code,
      beneficiaryName: r.beneficiary_name,
      upiId: r.upi_id,
      createdAt: r.created_at,
    }));

    res.json({ requests: formatted, count: formatted.length });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVerifiedRequests,
  getRequestById,
  createRequest,
  getMyRequests,
  getAllRequests,
};
