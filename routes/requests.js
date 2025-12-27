const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', requestController.getAllRequests);
router.get('/calendar/events', requestController.getCalendarRequests);
router.get('/stats/all', requestController.getStatistics);
router.get('/equipment/:equipmentId', requestController.getRequestsByEquipment);
router.get('/:id', requestController.getRequest);
// Authenticated users can create requests (any employee)
router.post('/', authenticate, requestController.createRequest);
// Updates/deletes require auth; additional checks enforced in controller
router.put('/:id', authenticate, requestController.updateRequest);
router.put('/:id/stage', authenticate, requestController.updateStage);
router.put('/:id/assign', authenticate, requestController.assignRequest);
router.put('/:id/complete', authenticate, requestController.completeRequest);
router.delete('/:id', authenticate, requestController.deleteRequest);

module.exports = router;
