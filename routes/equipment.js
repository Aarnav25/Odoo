const express = require('express');

const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', equipmentController.getAllEquipment);
router.get('/:id', equipmentController.getEquipment);
router.post('/', authenticate, authorizeRoles('Admin', 'Manager', 'Technician'), equipmentController.createEquipment);
router.put('/:id', authenticate, authorizeRoles('Admin', 'Manager', 'Technician'), equipmentController.updateEquipment);
router.delete('/:id', authenticate, authorizeRoles('Admin', 'Manager'), equipmentController.deleteEquipment);
router.get('/:id/requests', equipmentController.getEquipmentRequests);

module.exports = router;
