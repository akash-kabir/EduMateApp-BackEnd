const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/', protect, checkRole(['society_head']), createPost);

router.get('/', protect, getPosts);

router.get('/:id', protect, getPostById);

router.put('/:id', protect, updatePost);

router.delete('/:id', protect, deletePost);

module.exports = router;