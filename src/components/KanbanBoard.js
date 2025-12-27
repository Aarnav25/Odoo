import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaExclamationTriangle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { requestService } from '../services/api';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
  const [requests, setRequests] = useState({ 'New': [], 'In Progress': [], 'Repaired': [], 'Scrap': [] });
  const [loading, setLoading] = useState(true);
  const [completeModal, setCompleteModal] = useState(null);
  const [completionData, setCompletionData] = useState({ durationHours: '', completionNotes: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestService.getAll();
      const grouped = {
        'New': response.data.filter(r => r.stage === 'New'),
        'In Progress': response.data.filter(r => r.stage === 'In Progress'),
        'Repaired': response.data.filter(r => r.stage === 'Repaired'),
        'Scrap': response.data.filter(r => r.stage === 'Scrap'),
      };
      setRequests(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const stageOrder = ['New', 'In Progress', 'Repaired', 'Scrap'];

  const getNextStage = (currentStage) => {
    const currentIndex = stageOrder.indexOf(currentStage);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;
  };

  const handleTransitionStage = async (requestId, fromStage) => {
    const nextStage = getNextStage(fromStage);
    if (!nextStage) return;

    try {
      await requestService.updateStage(requestId, nextStage);
      fetchRequests();
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to transition request');
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const { durationHours, completionNotes } = completionData;
      if (!durationHours) {
        alert('Please enter duration in hours');
        return;
      }
      await requestService.complete(requestId, { durationHours: parseInt(durationHours), completionNotes });
      setCompleteModal(null);
      setCompletionData({ durationHours: '', completionNotes: '' });
      fetchRequests();
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to complete request');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="kanban-container">
      <h1>Maintenance Kanban Board</h1>
      <div className="kanban-board">
        {Object.keys(requests).map((stage) => (
          <div key={stage} className="kanban-column">
            <div className="column-header">
              <h2>{stage}</h2>
              <span className="count">{requests[stage].length}</span>
            </div>
            <div className="cards">
              {requests[stage].map((request) => (
                <div
                  key={request._id}
                  className={`card ${request.isOverdue ? 'overdue' : ''}`}
                >
                  {request.isOverdue && (
                    <div className="overdue-indicator">
                      <FaExclamationTriangle /> OVERDUE
                    </div>
                  )}
                  <div className="card-header">
                    <h3>{request.subject}</h3>
                    <span className={`priority ${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="equipment">{request.equipment?.name}</p>
                    <p className="category">{request.equipmentCategory}</p>
                  </div>
                  <div className="card-footer">
                    {request.assignedTo && (
                      <div className="assigned">
                        <img src={request.assignedTo.avatar} alt="avatar" />
                        <span>{request.assignedTo.name}</span>
                      </div>
                    )}
                    <div className="time">
                      <FaClock /> {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="card-actions">
                    {getNextStage(stage) && (
                      <button
                        className="btn-transition"
                        onClick={() => handleTransitionStage(request._id, stage)}
                        title={`Move to ${getNextStage(stage)}`}
                      >
                        <FaArrowRight /> {getNextStage(stage)}
                      </button>
                    )}
                    {stage === 'In Progress' && (
                      <button
                        className="btn-complete"
                        onClick={() => setCompleteModal(request._id)}
                      >
                        <FaCheckCircle /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {completeModal && (
        <div className="modal-overlay" onClick={() => setCompleteModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Mark Request as Complete</h2>
            <div className="form-group">
              <label>Duration (Hours) *</label>
              <input 
                type="number" 
                value={completionData.durationHours} 
                onChange={(e) => setCompletionData({ ...completionData, durationHours: e.target.value })}
                placeholder="Enter duration in hours"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Completion Notes</label>
              <textarea 
                value={completionData.completionNotes} 
                onChange={(e) => setCompletionData({ ...completionData, completionNotes: e.target.value })}
                placeholder="Add any completion notes..."
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={() => handleCompleteRequest(completeModal)}>Complete Request</button>
              <button className="btn-secondary" onClick={() => setCompleteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
