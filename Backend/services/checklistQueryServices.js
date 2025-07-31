const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger');
// const path = require('path');
// const fs = require('fs/promises');
// const { optimizeImage } = require('../libraries/imageOptimize');
// const { uploadToDrive } = require('../libraries/uploadToDrive');

const getChecklistQuestionQuery = async (questionfor) => {
    console.log(questionfor)
    try {
        const chklstName = await crmPool.query('select title from checklist_master WHERE chklst_id = $1', [questionfor.form])
        const chklstQuestions = await crmPool.query(`select q.chkque_id, q.sect_id, s.sect_name as Section, 
                q.question_text as Question, q.is_image_required as isImg_Require, q.score 
            from checklist_questions q
            left join checklist_sections s ON q.sect_id = s.sect_id
            WHERE q.chklst_id = $1 AND q.is_active = true
            ORDER BY q.sect_id, chkque_id`, [questionfor.form])
        return { title: chklstName.rows[0].title, questions: chklstQuestions.rows };
    } catch (error) {
        logMessage(`error while fetching data for ${questionfor.site}`, 'ERROR')
        throw new Error('Checklist data not found', error)
    }
}

const getChecklistDataQuery = async (user_id) => {
    try {
        const getchecklistoftheDay = await crmPool.query(`SELECT  
            s.site_id AS "siteId",
            s.site_name AS "siteName",

            json_build_object(
            'completed', COALESCE(opening.completed, false),
            'completedAt', opening.submitted_on,
            'id', 'v8aE1FXJqW'
            ) AS "openingChecklist",

            json_build_object(
            'completed', COALESCE(closing.completed, false),
            'completedAt', closing.submitted_on,
            'id', 'b6L7WfgjKn'
            ) AS "closingChecklist"

        FROM 
            public.sites s

        JOIN (
            SELECT DISTINCT ON (site_id) site_id
            FROM public.checklist_site_access
            WHERE users_id = $1
        ) csa ON s.site_id = csa.site_id

        LEFT JOIN (
            SELECT DISTINCT ON (ch.site_id)
                ch.site_id,
                true AS completed,
                ch.submitted_on
            FROM public.checklist_response_head ch
            WHERE ch.chklst_id = 'v8aE1FXJqW' 
            AND ch.site_id IS NOT NULL
            AND DATE(ch.submitted_on) = CURRENT_DATE
            ORDER BY ch.site_id, ch.submitted_on DESC
        ) opening ON s.site_id = opening.site_id

        LEFT JOIN (
            SELECT DISTINCT ON (ch.site_id)
                ch.site_id,
                true AS completed,
                ch.submitted_on
            FROM public.checklist_response_head ch
            WHERE ch.chklst_id = 'b6L7WfgjKn' 
            AND ch.site_id IS NOT NULL
            AND DATE(ch.submitted_on) = CURRENT_DATE
            ORDER BY ch.site_id, ch.submitted_on DESC
        ) closing ON s.site_id = closing.site_id

        WHERE s.isactive = true;`, [user_id])
        return getchecklistoftheDay.rows
    } catch (error) {
        logMessage(`error while fetching details of filled checklist`, 'ERROR')
        throw new Error('Data not found', error)
    }
}

const addChecklistQuery = async (formId, siteId, totalScore, responses) => {
    try {
        const client = await crmPool.connect()
        try {
            await client.query("BEGIN");

            // Insert into response header
            const headResult = await client.query(`
                INSERT INTO checklist_response_head (chklst_id, site_id, total_score)
                VALUES ($1, $2, $3)
            RETURNING response_id
            `, [formId, siteId, totalScore]);

            const respId = headResult.rows[0].response_id;

            await Promise.all(responses.map(item => {
                const { chkque_id, response, imageUrl, sect_id, score } = item;

            //     let finalImageUrl = null;

                
            // if (imageUrl) {
            //     const originalPath = path.resolve(imageUrl);
            //     const optimizedPath = path.resolve('temp', `opt_${path.basename(imageUrl)}`);

            //     try {
            //     await optimizeImage(originalPath, optimizedPath);

            //     const uploadResult = await uploadToDrive(
            //         optimizedPath,
            //         path.basename(optimizedPath)
            //     );

            //     finalImageUrl = uploadResult.webContentLink;

            //     // cleanup optimized file
            //     await fs.unlink(optimizedPath);
            //     } catch (err) {
            //     console.error(`Failed to process image for question ${chkque_id}:`, err);
            //     }
            // }

                return client.query(`
                    INSERT INTO checklist_response_questions 
                    (response_id, chkque_id, sect_id, score, img_url, response)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [respId, chkque_id, sect_id, score, imageUrl, response]);
            }));
            await client.query("COMMIT");
            return respId
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
    logMessage('Error while inserting data into checklist response table', 'ERROR')
    throw new Error(`data insertion failed for checklist responses: ${error.message}`)
}};

module.exports = {
    getChecklistDataQuery,
    getChecklistQuestionQuery,
    addChecklistQuery
}