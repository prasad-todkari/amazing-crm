const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/supcop');
const { getChecklistdataController } = require('../../controllers/checklistController');

router.get('/getFormDetails', getChecklistdataController)


module.exports = router;