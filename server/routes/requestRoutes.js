const express = require('express');
const router = express.Router();
const { getVerifiedRequests, getRequestById, createRequest, getMyRequests, getAllRequests } = require('../controllers/requestController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { requestRules, validate } = require('../middleware/validationMiddleware');

router.get('/verified', getVerifiedRequests); // Public or authenticated
router.get('/my', authenticate, authorize('RECEIVER'), getMyRequests);
router.get('/all', authenticate, authorize('ADMIN'), getAllRequests);
router.get('/:id', authenticate, getRequestById);
router.post('/', authenticate, authorize('RECEIVER'), requestRules, validate, createRequest);

module.exports = router;
