const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeam);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.post('/:id/members', teamController.addTeamMember);
router.delete('/:id/members', teamController.removeTeamMember);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
