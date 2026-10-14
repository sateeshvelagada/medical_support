const express = require('express');
const router = express.Router();
const { createDonation, getMyDonations } = require('../controllers/donationController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { donationRules, validate } = require('../middleware/validationMiddleware');

router.post('/', authenticate, authorize('DONOR'), donationRules, validate, createDonation);
router.get('/my', authenticate, authorize('DONOR'), getMyDonations);

module.exports = router;
