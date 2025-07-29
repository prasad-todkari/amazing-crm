const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger');
const { sendFeedbackEmail } = require('../libraries/mailTransporter')

const getGuestQuery = async (phone) => {
    try {
        const result = await crmPool.query('SELECT * FROM guest_master WHERE guestphone = $1', [phone])
        return result    
    } catch (error) {
       logMessage('error while getting Guest Data', 'ERROR')
       throw new Error 
    }
}

const addFeedbackQuery = async (feedbackData) => {
  if (!feedbackData) {
    throw new Error('No feedback data received');
  }

  const { name, phone, email, id, satisfaction, comment, siteId, ratings, submittedAt } = feedbackData;

  const client = await crmPool.connect();

  try {
    await client.query('BEGIN');

    // Check guest
    const guestResult = await client.query(
      `SELECT guestid FROM guest_master WHERE guestphone = $1 OR guestcard = $2 LIMIT 1`,
      [phone, id]
    );

    let guestId;
    if (guestResult.rows.length > 0) {
      guestId = guestResult.rows[0].guestid;
    } else {
      const insertGuestResult = await client.query(
        `INSERT INTO guest_master (guestname, guestphone, guestemail, guestcard)
         VALUES ($1, $2, $3, $4)
         RETURNING guestid`,
        [name, phone, email, id]
      );
      guestId = insertGuestResult.rows[0].guestid;
    }

    // Insert feedback
    const insertFeedbackResult = await client.query(
      `INSERT INTO feedback_master (site_id, guest_id, suggestions, satisfaction, submitted_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING feedback_id`,
      [siteId, guestId, comment, satisfaction, submittedAt]
    );

    const feedbackId = insertFeedbackResult.rows[0].feedback_id;

    // Insert ratings
    const ratingInsertPromises = ratings.map(({ question_id, rating }) => {
      return client.query(
        `INSERT INTO feedback_ratings (feedback_id, question_id, rating)
         VALUES ($1, $2, $3)`,
        [feedbackId, question_id, rating]
      );
    });

    await Promise.all(ratingInsertPromises);

    await client.query('COMMIT');

    if (email) {
        try {
            await sendFeedbackEmail(email, name, satisfaction);
            console.log('Confirmation email sent to:', email);
        } catch (mailErr) {
            console.error('Email sending failed:', mailErr.message);
            // You might log but not block the transaction if mail fails
        }
    }

    return { success: true, feedbackId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
    getGuestQuery,
    addFeedbackQuery
}