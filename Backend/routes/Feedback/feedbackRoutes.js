const express = require('express');
const { getGuestController,  addFeedbackController } = require('../../controllers/feedbackController');
const requestValidator = require('../../middleware/formValidator');
const router = express.Router();

// Route to get all masters
router.get('/guest', requestValidator, getGuestController);
router.post('/submitFeedback', requestValidator, addFeedbackController)

module.exports = router;