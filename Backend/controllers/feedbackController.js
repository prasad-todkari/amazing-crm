//const { logMessage } = require("../libraries/logger");

const { getGuestQuery, addFeedbackQuery } = require("../services/feedbackQueryServices");

const getGuestController = async (rec, res) => {
    const phone = rec.query.phone;
    try {
        const guestData = await getGuestQuery(phone);

        res.status(200).json({
            status: 'success',
            message: 'guest Data received',
            data: guestData.rows[0]
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status: 'Error',
            message: 'Error while getting Guest Data'
        })
    }
}

const addFeedbackController = async (req, res) => {
    const feedbackData = req.body;

    if (!feedbackData) {
        return res.status(400).json({
            status: 'error',
            message: 'No feedback data received',
        });
    }
    try {
        const result = await addFeedbackQuery(feedbackData);
        res.status(200).json({
            status: 'success',
            message: 'Feedback Added Successfully',
            data: result
        });
    } catch (error) {
        console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while adding Feedback'
        });
    }
};


module.exports = {
    getGuestController,
    addFeedbackController
}