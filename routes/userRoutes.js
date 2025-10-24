const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);
router.get('/society', protect, checkRole(['society_head']), (req, res) => {
  res.json({ message: 'Welcome Society Head! You have special access.' });
});

module.exports = router;
