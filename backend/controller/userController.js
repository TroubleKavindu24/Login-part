const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '24112000@Kk'; 

class UserController {

  async addUser(req, res) {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });

    try {
      await user.save();
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  

  async updateUser(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, updatedUser });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  


async loginUser(req, res) {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, userId: user._id, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}




}
module.exports = new UserController();
