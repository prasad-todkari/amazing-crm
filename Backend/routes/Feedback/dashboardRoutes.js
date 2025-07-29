const express = require('express')
const router = express.Router()
const supcop = require('../../middleware/supcop')
const { getDashKpicontroller, getDayWiseDataController, getSiteWiseDataController, getRecentFeedbackController, getMostAnsQuesController, getFeedbackController } = require('../../controllers/dashboardController')

router.get('/getKpiCard', supcop, getDashKpicontroller)
router.get('/getDayWise', supcop, getDayWiseDataController)
router.get('/getSiteWise', supcop, getSiteWiseDataController)
router.get('/getRecentFeedacks', supcop, getRecentFeedbackController)
router.get('/getMostAnswered', supcop, getMostAnsQuesController)
router.get('/getFeedbackDetails', supcop, getFeedbackController)

module.exports = router
