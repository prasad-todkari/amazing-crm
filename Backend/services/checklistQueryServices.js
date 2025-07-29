const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger');

const getChecklistDataQuery = async (questionfor) => {
    console.log(questionfor)
    try {
        const chklstName = await crmPool.query('select title from checklist_master WHERE chklst_id = $1', [questionfor.form])
        const chklstQuestions = await crmPool.query(`select q.chkque_id, q.sect_id, s.sect_name as Section, 
                q.question_text as Question, q.is_image_required as isImg_Require, q.score 
            from checklist_questions q
            left join checklist_sections s ON q.sect_id = s.sect_id
            WHERE q.chklst_id = $1 AND q.is_active = true
            ORDER BY q.sect_id, chkque_id`, [questionfor.form])
        return {title: chklstName.rows[0].title, questions: chklstQuestions.rows};
    } catch (error) {
        logMessage(`error while fetching data for ${questionfor.site}`, 'ERROR')
        throw new Error('Checklist data not found')
    }
}

module.exports = {
    getChecklistDataQuery
}