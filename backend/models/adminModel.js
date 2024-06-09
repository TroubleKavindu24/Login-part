const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema(
{
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    department: { type: String, required: true }  
},
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };
