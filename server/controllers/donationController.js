const { db, inMemoryDB } = require('../config/database');

// POST /api/donations — donor makes a real donation with bank details
const createDonation = async (req, res, next) => {
  try {
    const {
      requestId,
      amount,
      paymentMethod,
      donorAccountNumber,
      transactionUtr,
    } = req.body;

    const donorId = req.user.id;
    const donationAmount = parseFloat(amount);

    if (!requestId || !donationAmount || donationAmount <= 0) {
      return res.status(400).json({ error: 'Valid requestId and donation amount are required' });
    }

    const payRef = `TXN-MC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const utr = transactionUtr || `UTR${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    const donorAcc = donorAccountNumber || 'Bank A/c Ending in 4210';
    const method = paymentMethod || 'BANK_TRANSFER';

    if (db.isMySQL()) {
      // Find request to ensure it exists
      const requests = await db.query('SELECT * FROM medical_requests WHERE id = ?', [requestId]);
      if (!requests || requests.length === 0) {
        return res.status(404).json({ error: 'Medical request not found' });
      }

      const request = requests[0];

      // Insert donation
      const result = await db.query(
        `INSERT INTO donations 
         (donor_id, request_id, amount, payment_reference, payment_method, donor_account_number, transaction_utr, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'SUCCESS')`,
        [donorId, requestId, donationAmount, payRef, method, donorAcc, utr]
      );

      // Increment amount_received on request
      const newAmountReceived = parseFloat(request.amount_received || 0) + donationAmount;
      const isCompleted = newAmountReceived >= parseFloat(request.total_amount);
      const newStatus = isCompleted ? 'COMPLETED' : request.status;

      await db.query(
        'UPDATE medical_requests SET amount_received = ?, status = ? WHERE id = ?',
        [newAmountReceived, newStatus, requestId]
      );

      return res.status(201).json({
        message: 'Donation successfully verified and recorded',
        donation: {
          id: result.insertId,
          requestId,
          requestTitle: request.title,
          hospital: request.hospital,
          beneficiaryEscrowAccount: request.account_number,
          beneficiaryName: request.beneficiary_name,
          amount: donationAmount,
          donorAccountNumber: donorAcc,
          paymentReference: payRef,
          transactionUtr: utr,
          paymentStatus: 'SUCCESS',
          createdAt: new Date().toISOString(),
        },
      });
    } else {
      // Memory Store
      const request = inMemoryDB.medical_requests.find(r => r.id === parseInt(requestId));
      if (!request) {
        return res.status(404).json({ error: 'Medical request not found' });
      }

      const donation = {
        id: Date.now(),
        donor_id: donorId,
        request_id: parseInt(requestId),
        amount: donationAmount,
        payment_reference: payRef,
        payment_method: method,
        donor_account_number: donorAcc,
        transaction_utr: utr,
        payment_status: 'SUCCESS',
        created_at: new Date().toISOString(),
      };

      inMemoryDB.donations.unshift(donation);

      // Update amount_received on request
      request.amount_received = (parseFloat(request.amount_received || 0) + donationAmount);
      if (request.amount_received >= parseFloat(request.total_amount)) {
        request.status = 'COMPLETED';
      }

      return res.status(201).json({
        message: 'Donation successfully verified and recorded',
        donation: {
          id: donation.id,
          requestId: donation.request_id,
          requestTitle: request.title,
          hospital: request.hospital,
          beneficiaryEscrowAccount: request.account_number,
          beneficiaryName: request.beneficiary_name,
          amount: donationAmount,
          donorAccountNumber: donorAcc,
          paymentReference: payRef,
          transactionUtr: utr,
          paymentStatus: 'SUCCESS',
          createdAt: donation.created_at,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/donations/my — donor's real history
const getMyDonations = async (req, res, next) => {
  try {
    const donorId = req.user.id;
    let donations = [];

    if (db.isMySQL()) {
      const rows = await db.query(
        `SELECT d.id, d.request_id, d.amount, d.payment_reference, d.payment_method, 
                d.donor_account_number, d.transaction_utr, d.payment_status, d.created_at,
                r.title as request_title, r.hospital, r.account_number as escrow_account, r.beneficiary_name
         FROM donations d
         LEFT JOIN medical_requests r ON d.request_id = r.id
         WHERE d.donor_id = ?
         ORDER BY d.id DESC`,
        [donorId]
      );
      donations = rows || [];
    } else {
      const userDonations = inMemoryDB.donations.filter(d => d.donor_id === donorId);
      donations = userDonations.map(d => {
        const reqItem = inMemoryDB.medical_requests.find(r => r.id === d.request_id);
        return {
          id: d.id,
          request_id: d.request_id,
          amount: d.amount,
          payment_reference: d.payment_reference,
          payment_method: d.payment_method,
          donor_account_number: d.donor_account_number,
          transaction_utr: d.transaction_utr,
          payment_status: d.payment_status,
          created_at: d.created_at,
          request_title: reqItem ? reqItem.title : 'Medical Assistance Campaign',
          hospital: reqItem ? reqItem.hospital : 'Verified Hospital',
          escrow_account: reqItem ? reqItem.account_number : 'Escrow Verified',
          beneficiary_name: reqItem ? reqItem.beneficiary_name : 'Patient Escrow',
        };
      });
    }

    const formatted = donations.map(d => ({
      id: d.id,
      requestId: d.request_id,
      requestTitle: d.request_title || 'Medical Assistance Campaign',
      hospital: d.hospital || 'Verified Hospital',
      escrowAccount: d.escrow_account,
      beneficiaryName: d.beneficiary_name,
      amount: parseFloat(d.amount),
      paymentReference: d.payment_reference,
      paymentMethod: d.payment_method,
      donorAccountNumber: d.donor_account_number,
      transactionUtr: d.transaction_utr,
      paymentStatus: d.payment_status,
      createdAt: d.created_at,
    }));

    res.json({ donations: formatted, totalDonated: formatted.reduce((acc, curr) => acc + curr.amount, 0) });
  } catch (err) {
    next(err);
  }
};

module.exports = { createDonation, getMyDonations };
