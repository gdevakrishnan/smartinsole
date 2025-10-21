const BASE_URL = "https://smartinsole.onrender.com/api/patients";

// ✅ Get all patients
export const getAllPatients = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch all patients");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET all patients error:", error);
    return { status: "failed", message: "Failed to fetch patients" };
  }
};

// ✅ Get all patient IDs only
export const getAllPatientIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ids`);
    if (!response.ok) {
      throw new Error("Failed to fetch patient IDs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET patient IDs error:", error);
    return { status: "failed", message: "Failed to fetch patient IDs" };
  }
};

// ✅ Get a single patient by patient_id
export const getPatientById = async (patientId) => {
  try {
    const response = await fetch(`${BASE_URL}/${patientId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch patient with ID: ${patientId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET patient by ID error:", error);
    return { status: "failed", message: "Patient not found" };
  }
};

// ✅ Create a new patient
export const createPatient = async (patientData) => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create patient");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("POST create patient error:", error);
    return { status: "failed", message: "Failed to create patient" };
  }
};

// ✅ Update a patient by patient_id
export const updatePatientById = async (patientId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/${patientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update patient with ID: ${patientId}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PUT update patient error:", error);
    return { status: "failed", message: "Failed to update patient" };
  }
};