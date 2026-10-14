const express = require('express');
const router = express.Router();
const { createOrganRequest, getOrganRequests, updateOrganStatus } = require('../controllers/organController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { organRequestRules, validate } = require('../middleware/validationMiddleware');

router.post('/', authenticate, authorize('RECEIVER'), organRequestRules, validate, createOrganRequest);
router.get('/', authenticate, authorize('HOSPITAL', 'ADMIN'), getOrganRequests);
router.put('/:id/status', authenticate, authorize('HOSPITAL', 'ADMIN'), updateOrganStatus);

module.exports = router;
