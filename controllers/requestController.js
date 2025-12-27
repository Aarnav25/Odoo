const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const { stage, team, assignedTo, type, search } = req.query;
    let filter = {};

    if (stage) filter.stage = stage;
    if (team) filter.maintenanceTeam = team;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (type) filter.requestType = type;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await MaintenanceRequest.find(filter)
      .populate('equipment', 'name serialNumber location category')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Update isOverdue status
    requests.forEach((req) => {
      if (req.dueDate && new Date(req.dueDate) < new Date() && req.stage !== 'Repaired' && req.stage !== 'Scrap') {
        req.isOverdue = true;
      }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single request
exports.getRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment', 'name serialNumber location category maintenanceTeam')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name members')
      .populate('createdBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create request
exports.createRequest = async (req, res) => {
  const {
    subject,
    equipment,
    requestType,
    description,
    scheduledDate,
    priority,
    createdBy,
    dueDate,
  } = req.body;
  // If createdBy not provided, use authenticated user id when available
  const creator = createdBy || req.user?.id || req.user?._id;

  try {
    // Fetch equipment to auto-fill category and team
    let equipmentData = null;
    if (equipment) equipmentData = await Equipment.findById(equipment).populate('maintenanceTeam');

    const request = new MaintenanceRequest({
      subject,
      equipment: equipment || null,
      requestType,
      description,
      scheduledDate,
      priority,
      createdBy: creator,
      dueDate,
      stage: 'New',
      equipmentCategory: equipmentData?.category || req.body.equipmentCategory,
      maintenanceTeam: equipmentData?.maintenanceTeam?._id || req.body.maintenanceTeam,
      company: equipmentData?.company || req.body.company,
    });

    const newRequest = await request.save();
    const populated = await newRequest.populate([
      { path: 'equipment', select: 'name serialNumber location category' },
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'maintenanceTeam', select: 'name' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If the request is completed (Repaired), only Technicians can edit
    const requesterRole = req.user?.role;
    if (request.stage === 'Repaired' && requesterRole !== 'Technician') {
      return res.status(403).json({ message: 'Only Technicians can edit a completed request' });
    }

    // Update basic fields
    const updateFields = req.body;
    Object.assign(request, updateFields);
    request.updatedAt = Date.now();

    // Check if moving to Scrap stage
    if (updateFields.stage === 'Scrap') {
      const equipment = await Equipment.findById(request.equipment);
      if (equipment) {
        equipment.status = 'Scrapped';
        equipment.notes = (equipment.notes || '') + '\n[' + new Date().toISOString() + '] Equipment scrapped due to maintenance request.';
        await equipment.save();
      }
    }

    const updated = await request.save();
    const populated = await updated.populate([
      { path: 'equipment', select: 'name serialNumber location category' },
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'maintenanceTeam', select: 'name' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update stage (for Kanban drag & drop)
exports.updateStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { stage, updatedAt: Date.now() },
      { new: true }
    )
      .populate('equipment', 'name serialNumber location category')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .populate('createdBy', 'name email');

    // Handle Scrap stage
    if (stage === 'Scrap') {
      const equipment = await Equipment.findById(request.equipment);
      if (equipment) {
        equipment.status = 'Scrapped';
        equipment.notes = (equipment.notes || '') + '\n[' + new Date().toISOString() + '] Equipment scrapped due to maintenance request.';
        await equipment.save();
      }
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign request to technician
exports.assignRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId, stage: 'In Progress', updatedAt: Date.now() },
      { new: true }
    )
      .populate('equipment', 'name serialNumber location category')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .populate('createdBy', 'name email');

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Complete request
exports.completeRequest = async (req, res) => {
  try {
    const { durationHours, completionNotes } = req.body;
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      {
        stage: 'Repaired',
        durationHours,
        completionNotes,
        updatedAt: Date.now(),
      },
      { new: true }
    )
      .populate('equipment', 'name serialNumber location category')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .populate('createdBy', 'name email');

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get requests by equipment (for Equipment Maintenance button)
exports.getRequestsByEquipment = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      equipment: req.params.equipmentId,
    })
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .sort({ createdAt: -1 });

    const openCount = requests.filter((r) => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;

    res.json({ requests, openCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests for calendar (Preventive only)
exports.getCalendarRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      requestType: 'Preventive',
      scheduledDate: { $exists: true, $ne: null },
    })
      .populate('equipment', 'name serialNumber')
      .populate('assignedTo', 'name email avatar')
      .populate('maintenanceTeam', 'name')
      .sort({ scheduledDate: 1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalRequests = await MaintenanceRequest.countDocuments();
    const openRequests = await MaintenanceRequest.countDocuments({
      stage: { $in: ['New', 'In Progress'] },
    });
    const completedRequests = await MaintenanceRequest.countDocuments({ stage: 'Repaired' });
    const scrapRequests = await MaintenanceRequest.countDocuments({ stage: 'Scrap' });

    // Requests per team
    const requestsPerTeam = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$maintenanceTeam',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'maintenanceteams',
          localField: '_id',
          foreignField: '_id',
          as: 'team',
        },
      },
    ]);

    // Requests per category
    const requestsPerCategory = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$equipmentCategory',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalRequests,
      openRequests,
      completedRequests,
      scrapRequests,
      requestsPerTeam,
      requestsPerCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If completed, only Technicians can delete
    const requesterRole = req.user?.role;
    if (request.stage === 'Repaired' && requesterRole !== 'Technician') {
      return res.status(403).json({ message: 'Only Technicians can delete a completed request' });
    }

    await MaintenanceRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
