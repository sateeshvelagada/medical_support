const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

module.exports = { validateEmail, validatePhone, validatePassword, sanitizeInput };
