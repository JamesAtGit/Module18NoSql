
const User = require('../models/User');
const Thought = require('../models/Thought');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('friends');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get a single user by _id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends thoughts');
    if (!user) {
      return res.status(404).json({ message: 'No user found with this id' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update a user by _id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this id' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'No user found with this id' });
    }
    
    // Delete thoughts associated with the user
    await Thought.deleteMany({ username: user.username });
    res.json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add a friend
const addFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Remove a friend
const removeFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend };
