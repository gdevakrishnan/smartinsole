import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Thermometer, TrendingUp, Users, Plus, Edit2, X, Check, RefreshCw, Trash } from 'lucide-react';
import { createPatient, getAllPatients, updatePatientById, deletePatientById } from './serviceWorkers/serviceWorker';

// Components
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
    </div>
  </div>
);

const RiskBadge = ({ level }) => {
  const colors = {
    0: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
    1: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
    2: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
    3: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
    4: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },
    5: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' }
  };
  const style = colors[level] || colors[0];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

const PatientCard = ({ patient, onEdit, onView, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{patient.patient_id}</h3>
        <p className="text-sm text-gray-500">Updated: {new Date(patient.updatedAt).toLocaleString()}</p>
      </div>
      <RiskBadge level={patient.risk_level} />
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-blue-500" />
        <div>
          <p className="text-xs text-gray-500">Pressure</p>
          <p className="font-semibold text-gray-800">{patient.pressure_data} mmHg</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Thermometer className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-xs text-gray-500">Temperature</p>
          <p className="font-semibold text-gray-800">{patient.temperature}°F</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <div>
          <p className="text-xs text-gray-500">Motion</p>
          <p className="font-semibold text-gray-800">{patient.motion}</p>
        </div>
      </div>
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => onView(patient)}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        View Details
      </button>
      <button
        onClick={() => onEdit(patient)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
      >
        <Edit2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => onDelete(patient)}
        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-200"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const PatientForm = ({ patient, onSubmit, onCancel, isEdit }) => {
  const [formData, setFormData] = useState({
    patient_id: patient?.patient_id || '',
    pressure_data: patient?.pressure_data || '',
    temperature: patient?.temperature || '',
    motion: patient?.motion || '',
    risk_level: patient?.risk_level || 0
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.patient_id || !formData.pressure_data || !formData.temperature || !formData.motion) {
      setError('All fields are required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save patient');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
        <input
          type="text"
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
          disabled={isEdit}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="e.g., P001"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pressure Data (mmHg)</label>
          <input
            type="number"
            value={formData.pressure_data}
            onChange={(e) => setFormData({ ...formData, pressure_data: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="98.6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Motion</label>
          <input
            type="number"
            value={formData.motion}
            onChange={(e) => setFormData({ ...formData, motion: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level (0-5)</label>
          <input
            type="number"
            min="0"
            max="5"
            value={formData.risk_level}
            onChange={(e) => setFormData({ ...formData, risk_level: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>{isEdit ? 'Update Patient' : 'Create Patient'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const PatientDetails = ({ patient }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Pressure Data</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">{patient.pressure_data} mmHg</p>
      </div>

      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Thermometer className="w-6 h-6 text-red-600" />
          <h3 className="font-semibold text-gray-800">Temperature</h3>
        </div>
        <p className="text-3xl font-bold text-red-600">{patient.temperature}°F</p>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="font-semibold text-gray-800">Motion Level</h3>
        </div>
        <p className="text-3xl font-bold text-green-600">{patient.motion}</p>
      </div>

      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <AlertCircle className="w-6 h-6 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Risk Level</h3>
        </div>
        <div className="flex items-center space-x-3">
          <p className="text-3xl font-bold text-purple-600">{patient.risk_level}</p>
          <RiskBadge level={patient.risk_level} />
        </div>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Patient Information</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Patient ID:</span>
          <span className="font-semibold text-gray-800">{patient.patient_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Created:</span>
          <span className="font-semibold text-gray-800">{new Date(patient.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Updated:</span>
          <span className="font-semibold text-gray-800">{new Date(patient.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const loadPatients = async () => {
    setLoading(true);
    const data = await getAllPatients();
    setPatients(data);

    const total = data.length;
    const high = data.filter(p => p.risk_level >= 3).length;
    const medium = data.filter(p => p.risk_level === 2).length;
    const low = data.filter(p => p.risk_level <= 1).length;
    setStats({ total, high, medium, low });

    setLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleCreatePatient = async (formData) => {
    await createPatient(formData);
    await loadPatients();
    setModalType(null);
  };

  const handleUpdatePatient = async (formData) => {
    await updatePatientById(formData.patient_id, formData);
    await loadPatients();
    setModalType(null);
    setSelectedPatient(null);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setModalType('edit');
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setModalType('view');
  };

  const handleDelete = async (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.patient_id}?`)) {
      await deletePatientById(patient.patient_id);
      await loadPatients();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">SmartInSole</h1>
              <p className="text-gray-600 mt-1">Real-time patient health tracking</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadPatients}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setModalType('create')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Patients" value={stats.total} color="#3B82F6" />
          <StatCard icon={AlertCircle} title="High Risk" value={stats.high} color="#EF4444" />
          <StatCard icon={TrendingUp} title="Medium Risk" value={stats.medium} color="#F59E0B" />
          <StatCard icon={Activity} title="Low Risk" value={stats.low} color="#10B981" />
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first patient</p>
            <button
              onClick={() => setModalType('create')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={modalType === 'create'}
        onClose={() => setModalType(null)}
        title="Add New Patient"
      >
        <PatientForm
          onSubmit={handleCreatePatient}
          onCancel={() => setModalType(null)}
          isEdit={false}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'edit'}
        onClose={() => {
          setModalType(null);
          setSelectedPatient(null);
        }}
        title="Edit Patient"
      >
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleUpdatePatient}
          onCancel={() => {
            setModalType(null);
            setSelectedPatient(null);
          }}
          isEdit={true}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'view'}
        onClose={() => {
          setModalType(null);
          setSelectedPatient(null);
        }}
        title={`Patient Details - ${selectedPatient?.patient_id}`}
      >
        {selectedPatient && <PatientDetails patient={selectedPatient} />}
      </Modal>
    </div>
  );
}