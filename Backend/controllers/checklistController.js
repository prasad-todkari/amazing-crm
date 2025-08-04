const { getChecklistDataQuery, getChecklistQuestionQuery, addChecklistQuery } = require("../services/checklistQueryServices")

const getChecklistdataController = async (req, res) => {
    try {
        const questionfor = { form: req.query.formId, site: req.query.siteId }; 
        const checklistData = await getChecklistQuestionQuery(questionfor);
        res.status(200).json({
            success: true,
            data: checklistData
        });
    } catch (error) {
        console.error('Controller Error:', error.message);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

const getDayChecklistController = async (req, res) => {
    console.log(req.user)
    const user_id = req.user.data.userId;

    try {
        const dayChecklist = await getChecklistDataQuery(user_id)
        res.status(200).json({
            success: true,
            message: 'Day Checklist data fetched',
            data: dayChecklist
        })
    } catch (error) {
        console.error('CheckList controller Error', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addChecklistController = async (req, res) => {
    const { formId, siteId, totalScore, responses } = req.body;

    if (!formId || !siteId || !Array.isArray(responses)) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    try {
        const addChecklistdata = await addChecklistQuery(formId, siteId, totalScore, responses)
        res.status(200).json({
            status: 'success',
            message: 'Submitted successfully',
            responseId: addChecklistdata
        });
    } catch (error) {
         console.error("Error saving checklist:", error);
        res.status(500).json({ error: "Failed to submit checklist" });
    }
}

module.exports = {
    getChecklistdataController,
    getDayChecklistController,
    addChecklistController
}