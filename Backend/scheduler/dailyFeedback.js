const { fetchFeedbackData } = require('../services/dashBoardQueryServices');
const { sendEmail } = require('../libraries/mailTransporter');
const { getSiteEmail } = require('../services/masterQueryServices');
const { groupFeedbackBySite } = require('../services/groupSiteFeedback');
const { generateEmailContent } = require('../libraries/emailTemplates/negativeFeedback');
const cron = require('node-cron');

// Store prepared data in memory
let preparedData = {
  groupedFeedback: null,
  siteMap: null,
  lastFetched: null,
};

// First cron: Fetch and prepare data at 10:45 PM IST
const prepareFeedbackData = async () => {
  try {
    console.log('📅 Preparing feedback data at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    console.log('Fetching feedback data...');
    const feedbackList = await fetchFeedbackData();
    console.log('Feedback count:', feedbackList.length, 'Data:', feedbackList);

    console.log('Fetching site email data...');
    const siteData = await getSiteEmail();
    console.log('Site data:', siteData);

    console.log('Grouping feedback by site...');
    const groupedFeedback = groupFeedbackBySite(feedbackList);
    console.log('Grouped feedback:', groupedFeedback);

    const siteMap = {};
    siteData.forEach(site => {
      siteMap[site.name] = site.email;
    });
    console.log('Site email map:', siteMap);

    // Store prepared data
    preparedData = {
      groupedFeedback,
      siteMap,
      lastFetched: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    };
    console.log('✅ Data prepared successfully');
  } catch (err) {
    console.error('❌ Error preparing feedback data:', err.stack);
    preparedData = { groupedFeedback: null, siteMap: null, lastFetched: null }; // Reset on error
  }
};

// Second cron: Send emails at 10:50 PM IST
const sendDailyFeedbackEmailsSiteWise = async () => {
  try {
    console.log('📅 Starting email sending job at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    if (!preparedData.groupedFeedback || !preparedData.siteMap) {
      console.error('❌ No prepared data available. Run prepareFeedbackData first.');
      return;
    }

    for (const [siteName, feedbacks] of Object.entries(preparedData.groupedFeedback)) {
      const recipientEmail = preparedData.siteMap[siteName];
      if (!recipientEmail) {
        console.warn(`⚠️ No email for site: ${siteName}`);
        continue;
      }

      console.log(`Generating email content for ${siteName}...`);
      const html = generateEmailContent(feedbacks, feedbacks.length);
      console.log(`Sending email to ${recipientEmail} for ${siteName}...`);
      await sendEmail({
        to: recipientEmail,
        subject: `Daily Feedback Report - ${siteName} - ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}`,
        html,
      });
      console.log(`✅ Email sent for ${siteName} to ${recipientEmail}`);
    }
  } catch (err) {
    console.error('❌ Error sending site-wise feedback emails:', err.stack);
  }
};

// Schedule data preparation at 10:45 PM IST
cron.schedule('55 22 * * *', () => {
  console.log('⏰ Running data preparation at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  prepareFeedbackData();
}, { timezone: 'Asia/Kolkata' });

// Schedule email sending at 10:50 PM IST
cron.schedule('10 23 * * *', () => {
  console.log('⏰ Running email sending at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  sendDailyFeedbackEmailsSiteWise();
}, { timezone: 'Asia/Kolkata' });

console.log('🚀 Feedback cron initialized at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

// Export for manual testing
module.exports = { prepareFeedbackData, sendDailyFeedbackEmailsSiteWise };