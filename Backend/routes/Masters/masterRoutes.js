const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/supcop');
const { getAllSitesController, addSiteController, editSiteController, getAllCategoriesController, getAllUsersController, addNewUserController, editUserController, getSiteQuestionController, selectedQuestionscontroller, getSiteOnlyQController, getSiteNameController, getUserSiteAccess } = require('../../controllers/masterController');
const requestValidator = require('../../middleware/formValidator');

// Route to get all masters
router.get('/getSite', authMiddleware, getAllSitesController);
// Route to add a new master
router.post('/addSite',authMiddleware, addSiteController);
// Route to edit an existing master
router.post('/editSite', authMiddleware, editSiteController);
// Route to get all categories
router.get('/getCategories', authMiddleware, getAllCategoriesController);
// Route to get all users
router.get('/getUsers', authMiddleware, getAllUsersController);
// Route to add a new user
router.post('/addUser', authMiddleware, addNewUserController);
// Route to edit an existing user
router.post('/editUser', authMiddleware, editUserController);
// Router to get all Questions based on site
router.get('/getSiteQuestions', authMiddleware, getSiteQuestionController)
// Router to add selected Questions
router.post('/addSelectedQue', authMiddleware, selectedQuestionscontroller)
// Router to get Site specific Questions
router.get('/siteQuestions', requestValidator, getSiteOnlyQController)
// Router to Get Site Name
router.get('/getSiteName', requestValidator, getSiteNameController)
// router to get Users Site Access
router.get(`/getUserAccess`, authMiddleware, getUserSiteAccess)

module.exports = router;