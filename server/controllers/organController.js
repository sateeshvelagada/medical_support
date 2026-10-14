const { db, inMemoryDB } = require('../config/database');

// POST /api/organs — receiver submits organ request
const createOrganRequest = async (req, res, next) => {
  try {
    const { organType, bloodType, urgency, hospital, medicalSummary, requiredDate } = req.body;
    const patientId = req.user.id;

    if (!organType || !bloodType || !hospital) {
      return res.status(400).json({ error: 'Organ type, blood group, and hospital are required' });
    }

    if (db.isMySQL()) {
      const result = await db.query(
        `INSERT INTO organ_requests 
         (patient_id, hospital_name, organ_type, blood_type, urgency, medical_summary, required_date, status, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'VERIFIED')`,
        [
          patientId,
          hospital,
          organType,
          bloodType,
          urgency || 'HIGH',
          medicalSummary || '',
          requiredDate || new Date().toISOString().split('T')[0],
        ]
      );

      return res.status(201).json({
        message: 'Emergency organ support request verified and broadcasted to hospital network',
        organRequestId: result.insertId,
      });
    } else {
      const newReq = {
        id: Date.now(),
        patient_id: patientId,
        hospital_name: hospital,
        organ_type: organType,
        blood_type: bloodType,
        urgency: urgency || 'HIGH',
        medical_summary: medicalSummary || '',
        required_date: requiredDate || new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        verification_status: 'VERIFIED',
        created_at: new Date().toISOString(),
      };

      inMemoryDB.organ_requests.unshift(newReq);
      return res.status(201).json({
        message: 'Emergency organ support request verified and broadcasted to hospital network',
        organRequest: newReq,
      });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/organs — hospital & platform access
const getOrganRequests = async (req, res, next) => {
  try {
    let requests = [];

    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM organ_requests ORDER BY id DESC');
      requests = rows || [];
    } else {
      requests = inMemoryDB.organ_requests;
    }

    const formatted = requests.map(r => ({
      id: r.id,
      patientId: r.patient_id,
      hospital: r.hospital_name || r.hospital,
      organType: r.organ_type,
      bloodType: r.blood_type,
      urgency: r.urgency,
      medicalSummary: r.medical_summary,
      requiredDate: r.required_date,
      status: r.status,
      verificationStatus: r.verification_status,
      createdAt: r.created_at,
    }));

    res.json({ organRequests: formatted, count: formatted.length });
  } catch (err) {
    next(err);
  }
};

// PUT /api/organs/:id/status
const updateOrganStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id);

    if (db.isMySQL()) {
      await db.query('UPDATE organ_requests SET status = ? WHERE id = ?', [status, id]);
    } else {
      const target = inMemoryDB.organ_requests.find(r => r.id === id);
      if (target) target.status = status;
    }

    res.json({ message: `Organ request status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrganRequest, getOrganRequests, updateOrganStatus };
