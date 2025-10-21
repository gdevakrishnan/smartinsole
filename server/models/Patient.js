// models/Patient.js
const mongoose = require('mongoose');

const Patient = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pressure_data: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  motion: {
    type: Number,
    required: true
  },
  risk_level: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const PatientSchema = mongoose.model('Patient', Patient);

module.exports = PatientSchema;
