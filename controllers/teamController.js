const MaintenanceTeam = require('../models/MaintenanceTeam');

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate('members', 'name email department role')
      .populate('teamLead', 'name email');

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single team
exports.getTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate('members', 'name email department role')
      .populate('teamLead', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  const { name, description, specialty, members, teamLead } = req.body;

  const team = new MaintenanceTeam({
    name,
    description,
    specialty,
    members: members || [],
    teamLead,
  });

  try {
    const newTeam = await team.save();
    const populated = await newTeam.populate([
      { path: 'members', select: 'name email department role' },
      { path: 'teamLead', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    Object.assign(team, req.body);
    const updated = await team.save();
    const populated = await updated.populate([
      { path: 'members', select: 'name email department role' },
      { path: 'teamLead', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add member to team
exports.addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      const updated = await team.save();
      const populated = await updated.populate([
        { path: 'members', select: 'name email department role' },
        { path: 'teamLead', select: 'name email' },
      ]);
      return res.json(populated);
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove member from team
exports.removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.members = team.members.filter((id) => id.toString() !== userId);
    const updated = await team.save();
    const populated = await updated.populate([
      { path: 'members', select: 'name email department role' },
      { path: 'teamLead', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
