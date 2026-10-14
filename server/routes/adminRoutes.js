const express = require('express');
const router = express.Router();
const {
  getAdminRequests,
  verifyRequest,
  verifyDocument,
  getUsers,
  updateUserStatus,
  addHospital,
  verifyHospital,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(authenticate, authorize('ADMIN'));

router.get('/requests', getAdminRequests);
router.put('/requests/:id/verify', verifyRequest);
router.put('/documents/:id/verify', verifyDocument);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.post('/hospitals', addHospital);
router.put('/hospitals/:id/verify', verifyHospital);

module.exports = router;
