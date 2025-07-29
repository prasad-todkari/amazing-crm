 const express = require('express');
 const router = express.Router();
 const authMiddleware = require('../../middleware/supcop');
const { generateQRController } = require('../../controllers/commonController');

 router.post('/generate-qr', generateQRController)
 
module.exports = router;