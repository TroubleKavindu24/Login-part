const { Admin } = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '24112000@Kk'; 

class AdminController {

    async addAdmin(req, res) {
      const { firstName, lastName, email, password, department } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ firstName, lastName, email, password: hashedPassword, department });
  
      try {
        await admin.save();
        res.status(201).json({ success: true, admin });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    }

    async adminLogin(req, res) {
      const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }

      const payload = { adminId: admin._id, role: admin.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ success: true, adminId: admin._id, role: admin.role, token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAllAdmins(req, res){
    try {
      const admin = await Admin.find();
      res.status(200).json({ success: true, admin });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAdminById(req, res){
    const { id } = req.params;

    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        res.status(404).json({ success: false, message: 'Admin not found' });
        return;
      }
      res.status(200).json({ success: true, admin });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateAdminProfile(req, res) {

    const { id } = req.params;
    const updates = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using your secret key

      if (decoded.adminId !== id) { // Check if the ID in the token matches the ID in the request
        return res.status(403).json({ success: false, message: 'You are not authorized to update this profile' });
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedAdmin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      res.status(200).json({ success: true, updatedAdmin });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteAdminProfileById(req, res) {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using your secret key

      if (decoded.adminId !== id) { // Check if the ID in the token matches the ID in the request
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this profile' });
      }

      const deletedAdmin = await Admin.findByIdAndDelete(id);
      if (!deletedAdmin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      res.status(200).json({ success: true, message: 'Admin profile deleted successfully' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
}

module.exports = new AdminController();
