const express = require('express');
const router = express.Router();
const supcop = require('../../middleware/supcop');
const { getChecklistdataController, getDayChecklistController, addChecklistController } = require('../../controllers/checklistController');

router.get('/getFormDetails', supcop, getChecklistdataController)
router.get('/getDayChecklist', supcop, getDayChecklistController)
router.post('/addChecklist', supcop, addChecklistController)


module.exports = router;