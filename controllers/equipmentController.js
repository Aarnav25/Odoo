const Equipment = require('../models/Equipment');

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const { department, owner, search } = req.query;
    let filter = {};

    if (department) filter.department = department;
    if (owner) filter.owner = owner;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const equipment = await Equipment.find(filter)
      .populate('owner', 'name email')
      .populate('maintenanceTeam', 'name specialty')
      .populate('assignedTechnician', 'name email');

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single equipment
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('maintenanceTeam', 'name specialty members')
      .populate('assignedTechnician', 'name email');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create equipment
exports.createEquipment = async (req, res) => {
  const {
    name,
    serialNumber,
    category,
    department,
    owner,
    maintenanceTeam,
    assignedTechnician,
    purchaseDate,
    warrantyExpiry,
    location,
    notes,
  } = req.body;

  const equipment = new Equipment({
    name,
    serialNumber,
    category,
    department,
    owner,
    maintenanceTeam,
    assignedTechnician,
    purchaseDate,
    warrantyExpiry,
    location,
    notes,
  });

  try {
    const newEquipment = await equipment.save();
    const populated = await newEquipment.populate([
      { path: 'owner', select: 'name email' },
      { path: 'maintenanceTeam', select: 'name specialty' },
      { path: 'assignedTechnician', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    Object.assign(equipment, req.body);
    equipment.updatedAt = Date.now();
    const updated = await equipment.save();
    const populated = await updated.populate([
      { path: 'owner', select: 'name email' },
      { path: 'maintenanceTeam', select: 'name specialty' },
      { path: 'assignedTechnician', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get maintenance requests for a specific equipment
exports.getEquipmentRequests = async (req, res) => {
  try {
    const MaintenanceRequest = require('../models/MaintenanceRequest');
    const requests = await MaintenanceRequest.find({
      equipment: req.params.id,
    })
      .populate('assignedTo', 'name email')
      .populate('maintenanceTeam', 'name')
      .sort({ createdAt: -1 });

    const openCount = requests.filter((r) => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;

    res.json({ requests, openCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
