// routes/patientRouter.js
const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  getAllPatientIds,
  updatePatientById
} = require('../controllers/patientController');

// Routes
router.get('/', getAllPatients);               // Get all patient data
router.get('/ids', getAllPatientIds);          // Get all patient IDs
router.get('/:patient_id', getPatientById);    // Get specific patient by ID
router.post('/', createPatient);               // Create new patient
router.put('/:patient_id', updatePatientById); // Update patient by ID

module.exports = router;
