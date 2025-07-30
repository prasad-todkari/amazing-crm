const { getDashKpiService, getDayWiseQuery, getSiteWiseQuery, getRecentFeedback, getMostAnsQuesQuery, getFeedbackDetailQuery } = require("../services/dashBoardQueryServices");

const getDashKpicontroller = async (rec, res) => {
    const {userId, role} = rec.user.data
    
    try {
        const result = await getDashKpiService(userId, role);
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: result.rows
        });
    } catch (error) {
         console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching KPI Card Data'
        });
    }
}
const getDayWiseDataController = async (rec, res) => {
    try {
        const result = await getDayWiseQuery();
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: result.rows
        });
    } catch (error) {
        console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching Day wise Chart Data'
        });
    }
}

const getSiteWiseDataController = async (rec, res) => {
    try {
        const result = await getSiteWiseQuery();
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: result.rows
        });
    } catch (error) {
        console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching Site Wise Chart Data'
        });
    }
}

const getRecentFeedbackController = async (rec, res) => {
    try {
       const result = await getRecentFeedback();
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: result.rows
        }); 
    } catch (error) {
        console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching Site Wise Chart Data'
        }); 
    }
}

const getMostAnsQuesController = async (rec, res) => {
    try {
        const result = await getMostAnsQuesQuery();
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: result.rows
        }); 
    } catch (error) {
       console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching Site Wise Chart Data'
        });  
    }
}

const getFeedbackController = async (rec, res) => {
    try {
        const responce = await getFeedbackDetailQuery();
        res.status(200).json({
            status: 'success',
            message: 'data fetched Successfully',
            data: responce.rows
        }); 
    } catch (error) {
        console.error(`Error adding feedback:`, error.message);
        res.status(500).json({
            status: 'Error',
            message: 'Error while fetching Site Wise Chart Data'
        });  
    }
}

module.exports = {
    getDashKpicontroller,
    getDayWiseDataController,
    getSiteWiseDataController,
    getRecentFeedbackController,
    getMostAnsQuesController,
    getFeedbackController
}
