const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ firstName, lastName, username, email, password });

    if (user) {
      return res.status(201).json({
        token: generateToken(user._id),
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      return res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getProfile };
