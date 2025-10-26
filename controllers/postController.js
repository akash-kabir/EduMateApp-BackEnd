const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    console.log('=== Create Post Request ===');
    console.log('User:', req.user);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      postType,
      heading,
      body,
      location,
      eventDetails,
    } = req.body;

    if (!postType || !heading || !body) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Post type, heading, and body are required' });
    }

    if (postType === 'event') {
      if (!location?.campus) {
        console.log('Validation failed: Campus required for events');
        return res.status(400).json({ message: 'Campus is required for events' });
      }
      if (!eventDetails?.startDate || !eventDetails?.startTime) {
        console.log('Validation failed: Event date/time required');
        return res.status(400).json({ message: 'Event date and time are required' });
      }
    }

    const postData = {
      postType,
      heading,
      body,
      location: location || {},
      eventDetails: eventDetails || {},
      author: req.user._id,
      authorUsername: req.user.username,
    };

    console.log('Creating post with data:', JSON.stringify(postData, null, 2));

    const post = await Post.create(postData);

    console.log('Post created successfully:', post._id);

    const populatedPost = await Post.findById(post._id).populate('author', 'username firstName lastName');

    console.log('Populated post:', JSON.stringify(populatedPost, null, 2));

    return res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { postType, limit = 50, skip = 0 } = req.query;

    const filter = {};
    if (postType) {
      filter.postType = postType;
    }

    const posts = await Post.find(filter)
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Post.countDocuments(filter);

    return res.status(200).json({
      posts,
      total,
      hasMore: total > parseInt(skip) + posts.length,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username firstName lastName');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    return res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
