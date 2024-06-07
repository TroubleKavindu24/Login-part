const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '24112000@Kk'; // Make sure to use a secure secret in production

class UserController {

  async addUser(req, res) {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, role });

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
        res.status(404).json({ success: false, message: 'User not found' });
        return;
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

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }

      const payload = { userId: user._id, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ success: true, userId: user._id, role: user.role, token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
module.exports = new UserController();
