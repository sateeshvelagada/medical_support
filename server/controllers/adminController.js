// Admin controller — verification, user management, hospital management

// GET /api/admin/requests — all requests for admin
const getAdminRequests = async (req, res, next) => {
  try {
    // In production: SELECT * FROM medical_requests with full details
    res.json({ message: 'Admin request list — prototype', requests: [] });
  } catch (err) { next(err); }
};

// PUT /api/admin/requests/:id/verify
const verifyRequest = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'APPROVE' or 'REJECT'
    // In production: UPDATE medical_requests SET verification_status = ?, verified_by = ? WHERE id = ?
    res.json({
      message: `Request ${req.params.id} ${action === 'APPROVE' ? 'approved' : 'rejected'}`,
      verifiedBy: req.user.id,
      reason: reason || null,
    });
  } catch (err) { next(err); }
};

// PUT /api/admin/documents/:id/verify
const verifyDocument = async (req, res, next) => {
  try {
    const { action } = req.body;
    res.json({ message: `Document ${req.params.id} ${action}`, verifiedBy: req.user.id });
  } catch (err) { next(err); }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    res.json({ message: 'User list — prototype', users: [] });
  } catch (err) { next(err); }
};

// PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // ACTIVE, SUSPENDED
    res.json({ message: `User ${req.params.id} status updated to ${status}`, reason });
  } catch (err) { next(err); }
};

// POST /api/admin/hospitals
const addHospital = async (req, res, next) => {
  try {
    const { name, registrationNumber, address, contact } = req.body;
    res.status(201).json({ message: 'Hospital added', hospital: { id: Date.now(), name, registrationNumber, verificationStatus: 'PENDING' } });
  } catch (err) { next(err); }
};

// PUT /api/admin/hospitals/:id/verify
const verifyHospital = async (req, res, next) => {
  try {
    const { action } = req.body;
    res.json({ message: `Hospital ${req.params.id} ${action}` });
  } catch (err) { next(err); }
};

module.exports = { getAdminRequests, verifyRequest, verifyDocument, getUsers, updateUserStatus, addHospital, verifyHospital };
