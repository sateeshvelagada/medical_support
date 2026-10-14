const { body, validationResult } = require('express-validator');

// Collect validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['DONOR', 'RECEIVER']).withMessage('Role must be DONOR or RECEIVER'),
];

// Login validation rules
const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Medical request validation rules
const requestRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('disease').trim().notEmpty().withMessage('Disease is required'),
  body('hospital').trim().notEmpty().withMessage('Hospital is required'),
  body('totalAmount').isFloat({ min: 1000 }).withMessage('Amount must be at least ₹1000'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
];

// Donation validation rules
const donationRules = [
  body('requestId').isInt().withMessage('Valid request ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
];

// Organ request validation rules
const organRequestRules = [
  body('organType').trim().notEmpty().withMessage('Organ type is required'),
  body('bloodType').trim().notEmpty().withMessage('Blood type is required'),
  body('hospital').trim().notEmpty().withMessage('Hospital is required'),
  body('medicalSummary').trim().isLength({ min: 50 }).withMessage('Medical summary must be at least 50 chars'),
  body('requiredDate').isISO8601().withMessage('Valid date is required'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  requestRules,
  donationRules,
  organRequestRules,
};
