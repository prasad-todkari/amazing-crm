const { getChecklistDataQuery } = require("../services/checklistQueryServices")

const getChecklistdataController = async (req, res) => {
    try {
        const questionfor = { form: req.query.formId, site: req.query.siteId }; 
        const checklistData = await getChecklistDataQuery(questionfor);
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

module.exports = {
    getChecklistdataController
}