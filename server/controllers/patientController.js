// controllers/patientController.js
const Patient = require('../models/Patient');

// ✅ Get all patient data
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient data', error });
  }
};

// ✅ Get a single patient by patient_id
const getPatientById = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const patient = await Patient.findOne({ patient_id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient data', error });
  }
};

// ✅ Create a new patient
const createPatient = async (req, res) => {
  try {
    const { patient_id, pressure_data, temperature, motion, risk_level } = req.body;

    // Optional: prevent duplicate creation
    const existingPatient = await Patient.findOne({ patient_id });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }

    const newPatient = new Patient({
      patient_id,
      pressure_data,
      temperature,
      motion,
      risk_level
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error });
  }
};

// ✅ Get all patient IDs only
const getAllPatientIds = async (req, res) => {
  try {
    const ids = await Patient.find({}, { patient_id: 1, _id: 0 });
    res.status(200).json(ids.map(item => item.patient_id));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient IDs', error });
  }
};

// ✅ Update a patient by patient_id
const updatePatientById = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const updateData = req.body;

    const updatedPatient = await Patient.findOneAndUpdate(
      { patient_id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  getAllPatientIds,
  updatePatientById
};
