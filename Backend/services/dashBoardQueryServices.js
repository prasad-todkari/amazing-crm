const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger');

const getDashKpiService = async (userId, role) => {
    try {
         let siteIds = [];

         if (role === 'manager') {
            const siteRes = await crmPool.query(
                `SELECT site_id FROM user_site_access WHERE users_id = $1`,
                [userId]
            );
            siteIds = siteRes.rows.map(row => row.site_id);
        }
        const siteFilterSQL = siteIds.length
            ? `AND f.site_id = ANY($1)`
            : '';

        const responce = await crmPool.query(`WITH date_ranges AS (
                SELECT
                    current_date - interval '30 days' AS current_start,
                    current_date AS current_end,
                    current_date - interval '60 days' AS prev_start,
                    current_date - interval '30 days' AS prev_end
                ),
                feedback_counts AS (
                SELECT
                    COUNT(*) FILTER (WHERE submitted_at BETWEEN dr.current_start AND dr.current_end) AS current_total,
                    COUNT(*) FILTER (WHERE submitted_at BETWEEN dr.prev_start AND dr.prev_end) AS prev_total,
                    
                    COUNT(*) FILTER (WHERE satisfaction = 'not_satisfied' AND submitted_at BETWEEN dr.current_start AND dr.current_end) AS current_not_satisfied,
                    COUNT(*) FILTER (WHERE satisfaction = 'not_satisfied' AND submitted_at BETWEEN dr.prev_start AND dr.prev_end) AS prev_not_satisfied,
                    
                    COUNT(*) FILTER (WHERE satisfaction = 'satisfied' AND submitted_at BETWEEN dr.current_start AND dr.current_end) AS current_satisfied,
                    COUNT(*) FILTER (WHERE satisfaction = 'satisfied' AND submitted_at BETWEEN dr.prev_start AND dr.prev_end) AS prev_satisfied
                FROM feedback_master AS f, date_ranges dr
                WHERE 1=1 ${siteFilterSQL}
                ),
                ratings_avg AS (
                SELECT
                    AVG(r.rating) FILTER (WHERE f.submitted_at BETWEEN dr.current_start AND dr.current_end) AS current_avg,
                    AVG(r.rating) FILTER (WHERE f.submitted_at BETWEEN dr.prev_start AND dr.prev_end) AS prev_avg
                FROM feedback_ratings r
                JOIN feedback_master f ON f.feedback_id = r.feedback_id
                CROSS JOIN date_ranges dr
                WHERE 1=1 ${siteFilterSQL}
                )

                SELECT * FROM (
                -- Total Feedback
                SELECT
                    'Total Feedback' AS label,
                    to_char(fc.current_total, 'FM9,999') AS value,
                    CASE
                    WHEN fc.prev_total IS NULL OR fc.prev_total = 0 THEN '+100%'
                    ELSE CONCAT(
                        ROUND(((fc.current_total - fc.prev_total) * 100.0 / fc.prev_total), 1),
                        '%'
                    )
                    END AS delta
                FROM feedback_counts fc

                UNION ALL

                -- Average Satisfaction
                SELECT
                    'Average Satisfaction' AS label,
                    CONCAT(ROUND(100.0 * fc.current_satisfied / NULLIF(fc.current_total, 0), 1), '%') AS value,
                    CASE
                    WHEN fc.prev_total = 0 THEN '+100%'
                    ELSE
                        CONCAT(
                        ROUND(
                            (
                            (100.0 * fc.current_satisfied / NULLIF(fc.current_total, 0))
                            - (100.0 * fc.prev_satisfied / NULLIF(fc.prev_total, 0))
                            ), 1
                        ),
                        '%'
                        )
                    END AS delta
                FROM feedback_counts fc

                UNION ALL

                -- Average Rating
                SELECT
                    'Avg Rating' AS label,
                    ROUND(ra.current_avg, 1)::text AS value,
                    CASE
                    WHEN ra.prev_avg IS NULL THEN '+0'
                    ELSE CONCAT(
                        CASE WHEN ra.current_avg - ra.prev_avg >= 0 THEN '+' ELSE '' END,
                        ROUND(ra.current_avg - ra.prev_avg, 1)
                    )
                    END AS delta
                FROM ratings_avg ra

                UNION ALL

                -- Not Satisfaction
                SELECT
                    'Not Satisfaction' AS label,
                    fc.current_not_satisfied::text AS value,
                    CONCAT(
                    CASE WHEN fc.current_not_satisfied - fc.prev_not_satisfied >= 0 THEN '+' ELSE '' END,
                    fc.current_not_satisfied - fc.prev_not_satisfied
                    ) AS delta
                FROM feedback_counts fc
                ) AS metrics;
            `, siteIds.length ? [siteIds] : [])
        return responce
    } catch (error) {
        logMessage('error while getting Guest Data', 'ERROR')
       throw new Error 
    }
}

const getDayWiseQuery = async () => {
    try {
        const result = await crmPool.query(`SELECT 
                TO_CHAR(submitted_at, 'Dy') AS day,
                SUM(CASE WHEN satisfaction = 'satisfied' THEN 1 ELSE 0 END) AS "Satisfied",
                SUM(CASE WHEN satisfaction = 'not_satisfied' THEN 1 ELSE 0 END) AS "NotSatisfied"
            FROM 
                feedback_master
            WHERE 
                submitted_at >= NOW() - INTERVAL '7 days'
            GROUP BY 
                day
            ORDER BY 
                MIN(submitted_at);`
            )
        return result
    } catch (error) {
        logMessage('error while getting Guest Data', 'ERROR')
        throw new Error 
    }
}

const getSiteWiseQuery = async () => {
    try {
        const result = await crmPool.query(`SELECT 
            b.site_name as name, 
            COUNT(a.site_id) as value 
        FROM 
            feedback_master a
        LEFT JOIN 
            sites b ON a.site_id = b.site_id
        WHERE 
            a.submitted_at >= date_trunc('month', NOW()) 
            AND a.submitted_at < date_trunc('month', NOW() + INTERVAL '1 month')
        GROUP BY 
            b.site_name
        ORDER BY
            count(a.site_id) DESC
        LIMIT 10`)
    return result
    } catch (error) {
        logMessage('error while getting Guest Data', 'ERROR')
        throw new Error  
    }
}

const getRecentFeedback = async () => {
    try {
        const recent = await crmPool.query(`SELECT 
            g.guestname as name, 
            f.satisfaction as status,
            f.suggestions as comment,
            f.submitted_at as time, 
            ROUND(avg(d.rating),2) as rating
        from feedback_master f
        left join guest_master g ON f.guest_id = g.guestid
        left join feedback_ratings d ON f.feedback_id = d.feedback_id
        GROUP BY g.guestname, f.satisfaction, f.suggestions, f.submitted_at
        ORDER BY f.submitted_at DESC
        LIMIT 10`)
        return recent
    } catch (error) {
        logMessage('error while getting Recent Feedback', 'ERROR')
        throw new Error
    }
}

const getMostAnsQuesQuery = () => {
    try {
        const mostAnswered = crmPool.query(`SELECT q.question_text, avg(r.rating), count(r.rating) FROM feedback_ratings r
            LEFT JOIN questions q ON r.question_id = q.question_id
            LEFT JOIN feedback_master a ON a.feedback_id = r.feedback_id
            WHERE 
                a.submitted_at >= date_trunc('month', NOW()) 
                AND a.submitted_at < date_trunc('month', NOW() + INTERVAL '1 month')
            GROUP BY q.question_text
            ORDER BY count(r.rating) DESC
            LIMIT 10
        `)
        return mostAnswered;
    } catch (error) {
        logMessage('error while getting Recent Feedback', 'ERROR')
        throw new Error
    }
}

const getFeedbackDetailQuery = async (userId, role) => {
    let siteIds = [];

    if (role === 'manager') {
        const siteRes = await crmPool.query(
        `SELECT site_id FROM user_site_access WHERE users_id = $1`,
        [userId]
        );
        siteIds = siteRes.rows.map(row => row.site_id);
    }

    const siteFilterSQL = siteIds.length ? `WHERE f.site_id = ANY($1)` : '';

    try {
        const result = await crmPool.query(`SELECT 
                    g.guestname AS user, 
                    g.guestemail AS email,
                    s.site_name AS site,
                    f.satisfaction AS status,
                    f.suggestions AS comment,
                    f.submitted_at AS date, 
                    ROUND(AVG(d.rating), 2) AS rating
                FROM 
                    feedback_master f
                LEFT JOIN 
                    guest_master g ON f.guest_id = g.guestid
                LEFT JOIN 
                    feedback_ratings d ON f.feedback_id = d.feedback_id
                LEFT JOIN 
                    sites s ON f.site_id = s.site_id
                ${siteFilterSQL}
                GROUP BY 
                    g.guestname, g.guestemail, s.site_name, f.satisfaction, f.suggestions, f.submitted_at
                ORDER BY 
                    f.submitted_at DESC;`, siteIds.length ? [siteIds] : [])
        return result
    } catch (error) {
        logMessage('error whle getting Feedack details', 'ERROR')
    }
}

const fetchFeedbackData = async () => {
    try {
        const result = await crmPool.query(`SELECT 
                    g.guestname AS user, 
                    g.guestemail AS email,
                    s.site_name AS site,
                    f.satisfaction AS status,
                    f.suggestions AS comment,
                    f.submitted_at AS date, 
                    ROUND(AVG(d.rating), 2) AS rating
                FROM 
                    feedback_master f
                LEFT JOIN 
                    guest_master g ON f.guest_id = g.guestid
                LEFT JOIN 
                    feedback_ratings d ON f.feedback_id = d.feedback_id
                LEFT JOIN 
                    sites s ON f.site_id = s.site_id
                WHERE
				    f.submitted_at >= current_date
                GROUP BY 
                    g.guestname, g.guestemail, s.site_name, f.satisfaction, f.suggestions, f.submitted_at
                ORDER BY 
                    f.submitted_at DESC;`)
        return result.rows
    } catch (error) {
        logMessage('error whle getting Feedack details', 'ERROR')
    }
}

module.exports = {
    getDashKpiService,
    getDayWiseQuery,
    getSiteWiseQuery,
    getRecentFeedback,
    getMostAnsQuesQuery,
    getFeedbackDetailQuery,
    fetchFeedbackData
}