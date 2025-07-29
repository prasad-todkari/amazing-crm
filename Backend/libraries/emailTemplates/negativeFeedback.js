const generateEmailContent = (feedbackList, totalFeedback) => {
  const negativeFeedback = feedbackList.filter(
    fb => fb.status === 'not satisfied' || fb.rating < 3
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 32px;
          color: #1a1a1a;
          line-height: 1.5;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 32px;
        }
        .summary {
          margin-bottom: 32px;
          text-align: center;
          background-color: #f8fafc;
          padding: 24px;
          border-radius: 8px;
        }
        .summary h2 {
          font-size: 22px;
          color: #1e293b;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        .summary p {
          color: #475569;
          margin: 0;
          font-size: 16px;
        }
        .feedback-item {
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 0;
        }
        .feedback-item:last-child {
          border-bottom: none;
        }
        .feedback-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        .feedback-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 16px;
        }
        .feedback-status {
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
        }
        .feedback-status.not-satisfied {
          background-color: #ef4444;
        }
        .feedback-comment {
          color: #475569;
          font-size: 15px;
          margin: 12px 0;
          line-height: 1.6;
        }
        .feedback-location {
          color: #6b7280;
          font-size: 13px;
          margin: 8px 0;
          font-style: italic;
        }
        .feedback-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #6b7280;
          gap: 20px;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .rating .star {
          color: #fac518ff;
          font-size: 16px;
        }
        .rating .empty-star {
          color: #d1d5db;
        }
        .rating .rating-badge {
          background-color: #302e2eff;
          padding: 2px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: bold;
          color: #f4f5f8ff;
          border: 1px solid #191a1bff;
        }
        .footer {
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
          padding: 20px;
          text-align: center;
          color: #ffffff;
        }
        .footer p {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Daily Feedback Report</h1>
        </div>
        <div class="content">
          <div class="summary">
            <h2>Total Feedback Collected: ${totalFeedback}</h2>
            <p>Negative Feedback: ${negativeFeedback.length}</p>
          </div>
          <h3>Negative Feedback Details</h3>
          ${negativeFeedback.length === 0 ? 
            '<p>No negative feedback received today.</p>' : 
            negativeFeedback.map(fb => `
              <div class="feedback-item">
                <div class="feedback-header">
                  <span class="feedback-name" style="margin-right: 10px">${fb.user}</span>
                  <span class="feedback-status not-satisfied">Not Satisfied</span>
                </div>
                <p class="feedback-comment">${fb.comment}</p>
                <p class="feedback-location">Location: ${fb.site || 'Not specified'}</p>
                <div class="feedback-meta">
                  <div class="rating">
                    ${[...Array(5)].map((_, i) => `
                      <span class="star ${i < fb.rating ? '' : 'empty-star'}">★</span>
                    `).join('')}
                    <span style="font-weight: bold; margin-right: 20px; margin-left: 20px;">${parseFloat(fb.rating).toFixed(1)}</span>
                  </div>
                  <span>${new Date(fb.date).toLocaleDateString()}</span>
                </div>
              </div>
            `).join('')}
        </div>
        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateEmailContent
}