const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { db, inMemoryDB } = require('../config/database');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const userRole = role ? role.toUpperCase() : 'DONOR';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    if (db.isMySQL()) {
      const existing = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (name, email, phone, password_hash, role, account_status) VALUES (?, ?, ?, ?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), phone || '', passwordHash, userRole, 'ACTIVE']
      );

      const userId = result.insertId;
      const user = {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        role: userRole,
        account_status: 'ACTIVE',
      };

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return res.status(201).json({ message: 'Registration successful', user, token });
    } else {
      // Memory Store
      const existing = inMemoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        password_hash: passwordHash,
        role: userRole,
        account_status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };

      inMemoryDB.users.push(newUser);
      const safeUser = { ...newUser };
      delete safeUser.password_hash;

      const token = generateToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });
      return res.status(201).json({ message: 'Registration successful', user: safeUser, token });
    }
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let userRecord = null;

    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
      if (rows && rows.length > 0) {
        userRecord = rows[0];
      }
    } else {
      userRecord = inMemoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    }

    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const safeUser = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
      account_status: userRecord.account_status,
      avatar: userRecord.name ? userRecord.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US',
    };

    const token = generateToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });

    res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let userRecord = null;

    if (db.isMySQL()) {
      const rows = await db.query('SELECT id, name, email, phone, role, account_status FROM users WHERE id = ?', [userId]);
      if (rows && rows.length > 0) userRecord = rows[0];
    } else {
      const found = inMemoryDB.users.find(u => u.id === userId);
      if (found) {
        userRecord = { ...found };
        delete userRecord.password_hash;
      }
    }

    if (!userRecord) {
      return res.status(404).json({ error: 'User not found' });
    }

    userRecord.avatar = userRecord.name ? userRecord.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
    res.json({ user: userRecord });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
