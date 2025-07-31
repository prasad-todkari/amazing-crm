const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/supcop');
const { getChecklistdataController, getDayChecklistController, addChecklistController } = require('../../controllers/checklistController');

router.get('/getFormDetails', getChecklistdataController)
router.get('/getDayChecklist', authMiddleware, getDayChecklistController)
router.post('/addChecklist', authMiddleware, addChecklistController)


module.exports = router;