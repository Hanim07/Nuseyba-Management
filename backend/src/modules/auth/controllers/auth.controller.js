const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const register = async (req, res, next) => {
  try {
    const { full_name, username, password, role_name, campus_id } = req.body;

    // Basic validation
    if (!full_name || !username || !password || !role_name) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    }

    // Find role
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid role' } });
    }

    // Check if username exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Username already taken' } });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      full_name,
      username,
      password_hash,
      role_id: role.id,
      campus_id: campus_id || null
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        full_name: newUser.full_name,
        username: newUser.username,
        role: role.name
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing username or password' } });
    }

    // Find user
    const user = await User.findOne({ 
      where: { username },
      include: [{ model: Role, as: 'role' }] 
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Invalid credentials or inactive account' } });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Invalid credentials' } });
    }

    // Generate JWT
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role.name,
      campus_id: user.campus_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', { expiresIn: '1d' });

    res.json({
      success: true,
      data: {
        token,
        user: payload
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
