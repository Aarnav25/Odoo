import React, { useEffect, useState } from 'react';
import { equipmentService, requestService, teamService, userService } from '../services/api';
import { FaWrench, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/EquipmentList.css';

const CATEGORY_OPTIONS = ['Machine', 'Vehicle', 'Computer', 'Other'];

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [equipmentRequests, setEquipmentRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    serialNumber: '',
    category: '',
    department: '',
    location: '',
    maintenanceTeam: '',
    assignedTechnician: '',
    company: '',
  });

  const [newRequest, setNewRequest] = useState({ subject: '', equipment: '', requestType: 'Corrective', scheduledDate: '', description: '', priority: 'Medium' });

  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [equipmentIssueCount, setEquipmentIssueCount] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('gearguard_user') || 'null');

  useEffect(() => {
    fetchTeamsAndTechs();
    fetchEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeamsAndTechs = async () => {
    try {
      const [teamResp, userResp] = await Promise.all([teamService.getAll(), userService.getAll()]);
      const user = JSON.parse(localStorage.getItem('gearguard_user') || 'null');
      const allTeams = teamResp.data || [];
      setTeams(allTeams.filter(t => !user?.company || t.company === user.company || !t.company));
      const techs = (userResp.data || []).filter(u => u.role === 'Technician' && (!user?.company || u.company === user.company));
      setTechnicians(techs);
    } catch (err) {
      console.error('Error fetching teams or users', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await equipmentService.getAll();
      const user = JSON.parse(localStorage.getItem('gearguard_user') || 'null');
      let filtered = response.data || [];
      if (user?.company) filtered = filtered.filter(eq => eq.company === user.company);
      setEquipment(filtered);

      const issueCounts = {};
      await Promise.all(filtered.map(async (eq) => {
        try {
          const reqResponse = await requestService.getByEquipment(eq._id);
          const openRequests = (reqResponse.data.requests || []).filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap');
          issueCounts[eq._id] = openRequests.length;
        } catch (err) {
          issueCounts[eq._id] = 0;
        }
      }));

      setEquipmentIssueCount(issueCounts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to fetch equipment');
      setLoading(false);
    }
  };

  const handleMaintenanceClick = async (equip) => {
    setSelectedEquipment(equip);
    try {
      const response = await requestService.getByEquipment(equip._id);
      setEquipmentRequests(response.data.requests || []);
      setShowRequests(true);
    } catch (err) {
      console.error('Error fetching equipment requests:', err);
    }
  };

  const sanitizePayload = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      if (v !== '' && v !== null && v !== undefined) cleaned[k] = v;
    });
    return cleaned;
  };

  const handleCreateEquipment = async () => {
    try {
      setError('');
      const required = ['name', 'serialNumber', 'category', 'department', 'company', 'location', 'maintenanceTeam'];
      for (const r of required) if (!newEquipment[r]) {
        setError('Please fill in all required fields');
        return;
      }
      if (!CATEGORY_OPTIONS.includes(newEquipment.category)) {
        setError('Invalid category selected');
        return;
      }

      const payload = sanitizePayload({ ...newEquipment, status: 'Active' });
      await equipmentService.create(payload);
      setSuccess('Equipment added successfully!');
      setShowAddModal(false);
      setNewEquipment({ name: '', serialNumber: '', category: '', department: '', location: '', maintenanceTeam: '', assignedTechnician: '', company: '' });
      setTimeout(() => setSuccess(''), 3000);
      fetchEquipment();
    } catch (err) {
      console.error('Error creating equipment', err);
      setError(err.response?.data?.message || 'Failed to create equipment');
    }
  };

  const handleCreateRequest = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('gearguard_user') || 'null');
      const payload = sanitizePayload({ ...newRequest, createdBy: user?.id || user?._id });
      await requestService.create(payload);
      setShowAddRequestModal(false);
      setNewRequest({ subject: '', equipment: '', requestType: 'Corrective', scheduledDate: '', description: '', priority: 'Medium' });
      fetchEquipment();
    } catch (err) {
      console.error('Error creating request', err);
      setError('Failed to create request');
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      if (!window.confirm('Delete this equipment? This cannot be undone.')) return;
      await equipmentService.delete(id);
      setEquipment((prev) => prev.filter((e) => e._id !== id));
      setEquipmentIssueCount((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setSuccess('Equipment deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting equipment', err);
      setError(err.response?.data?.message || 'Failed to delete equipment');
    }
  };

  if (loading) return <div className="loading">Loading equipment...</div>;

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1>Equipment Management</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Machine
          </button>
          <button className="btn-secondary" onClick={() => setShowAddRequestModal(true)}>
            <FaWrench /> Add Issue
          </button>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {showRequests && selectedEquipment && (
        <div className="modal-overlay" onClick={() => setShowRequests(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Maintenance Requests - {selectedEquipment.name}</h2>
            <p className="badge">Open Requests: {(equipmentRequests || []).filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length}</p>
            <div className="requests-list">
              {(equipmentRequests || []).length > 0 ? (
                equipmentRequests.map((req) => (
                  <div key={req._id} className="request-item">
                    <h4>{req.subject}</h4>
                    <p>Stage: <span className={`stage ${req.stage.toLowerCase().replace(' ', '-')}`}>{req.stage}</span></p>
                    {req.assignedTo && <p>Assigned to: {req.assignedTo.name}</p>}
                  </div>
                ))
              ) : (
                <p>No requests for this equipment.</p>
              )}
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setShowRequests(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Machine</h2>
            <div className="form-group">
              <label>Name *</label>
              <input value={newEquipment.name} onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })} placeholder="Machine name" />
            </div>
            <div className="form-group">
              <label>Serial Number *</label>
              <input value={newEquipment.serialNumber} onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })} placeholder="Serial Number" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={newEquipment.category} onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}>
                <option value="">-- Select category --</option>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input value={newEquipment.department} onChange={(e) => setNewEquipment({ ...newEquipment, department: e.target.value })} placeholder="Department" />
            </div>
            <div className="form-group">
              <label>Maintenance Team *</label>
              <select value={newEquipment.maintenanceTeam} onChange={(e) => setNewEquipment({ ...newEquipment, maintenanceTeam: e.target.value })}>
                <option value="">-- Select team --</option>
                {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Technician</label>
              <select value={newEquipment.assignedTechnician} onChange={(e) => setNewEquipment({ ...newEquipment, assignedTechnician: e.target.value })}>
                <option value="">-- Optional --</option>
                {technicians.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input value={newEquipment.company} onChange={(e) => setNewEquipment({ ...newEquipment, company: e.target.value })} placeholder="Company name" />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input value={newEquipment.location} onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })} placeholder="Location" />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateEquipment}>Create</button>
              <button className="btn-secondary" onClick={() => { setShowAddModal(false); setError(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddRequestModal && (
        <div className="modal-overlay" onClick={() => setShowAddRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Maintenance Request</h2>
            <div className="form-group">
              <label>Subject</label>
              <input value={newRequest.subject} onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Equipment</label>
              <select value={newRequest.equipment} onChange={(e) => setNewRequest({ ...newRequest, equipment: e.target.value })}>
                <option value="">-- Select equipment --</option>
                {equipment.map(eq => <option key={eq._id} value={eq._id}>{eq.name} ({eq.serialNumber})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={newRequest.requestType} onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}>
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>
            {newRequest.requestType === 'Preventive' && (
              <div className="form-group">
                <label>Scheduled Date</label>
                <input type="date" value={newRequest.scheduledDate} onChange={(e) => setNewRequest({ ...newRequest, scheduledDate: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label>Description</label>
              <textarea value={newRequest.description} onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })} />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleCreateRequest}>Create Request</button>
              <button className="btn-secondary" onClick={() => setShowAddRequestModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="equipment-grid">
        {equipment.map((equip) => (
          <div key={equip._id} className="equipment-card">
            <div className="card-header">
              <h3>{equip.name}</h3>
              <span className={`status ${equip.status?.toLowerCase() || 'unknown'}`}>{equip.status || 'Unknown'}</span>
            </div>
            <div className="card-body">
              <p><strong>Serial:</strong> {equip.serialNumber}</p>
              <p><strong>Category:</strong> {equip.category}</p>
              <p><strong>Department:</strong> {equip.department}</p>
              <p><strong>Location:</strong> {equip.location}</p>
              {equip.purchaseDate && (
                <p><strong>Purchased:</strong> {new Date(equip.purchaseDate).toLocaleDateString()}</p>
              )}
              {equipmentIssueCount[equip._id] !== undefined && (
                <p className="issues-badge">
                  <strong>Open Issues:</strong> <span className={`badge ${equipmentIssueCount[equip._id] > 0 ? 'has-issues' : 'no-issues'}`}>{equipmentIssueCount[equip._id]}</span>
                </p>
              )}
            </div>
            <div className="card-actions">
              <button 
                className="btn-maintenance"
                onClick={() => handleMaintenanceClick(equip)}
              >
                <FaWrench /> Maintenance
              </button>
              <button className="btn-edit"><FaEdit /></button>
              {(currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
                <button className="btn-delete" onClick={() => handleDeleteEquipment(equip._id)}><FaTrash /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
