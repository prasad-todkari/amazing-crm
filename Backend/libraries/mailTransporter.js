const nodemailer = require('nodemailer');
const thankYouTemplate = require('./emailTemplates/ThankYouTemplate.');
const apologyTemplate = require('./emailTemplates/ApologyTemplate');
const cron = require('node-cron');
const { generateEmailContent } = require('./emailTemplates/negativeFeedback');
const { fetchFeedbackData } = require('../services/dashBoardQueryServices');
require('dotenv').config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS 
  }
});

 const sendFeedbackEmail = async (to, name, satisfaction) => {
  const isPositive = satisfaction.toLowerCase() === 'satisfied';

  const html = isPositive ? thankYouTemplate(name) : apologyTemplate(name);
  const subject = isPositive ? 'Thank You for Your Feedback!' : 'We’re Sorry to Hear That';

  const mailOptions = {
    from: 'A Feedback Hub <admin@indusnova.tech>',
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

// Function to send email
const sendDailyFeedbackEmail = async () => {
  try {
    const feedbackList = await fetchFeedbackData();
    console.log(feedbackList);
    const totalFeedback = feedbackList.length;
    const htmlContent = generateEmailContent(feedbackList, totalFeedback);

    const mailOptions = {
      from: 'Feedback - Reporting Tool <admin@indusnova.tech>',
      to: 'prasad.todkari@afoozo.com', 
      subject: `Daily Feedback Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Daily feedback email sent successfully');
  } catch (error) {
    console.error('Error sending daily feedback email:', error);
  }
};

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: 'Feedback - Reporting Tool <your_email@gmail.com>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Schedule email to run every night at 11 PM
cron.schedule('00 23 * * *', () => {
  console.log('Running daily feedback email task...');
  sendDailyFeedbackEmail();
});

module.exports = { sendFeedbackEmail, sendEmail };