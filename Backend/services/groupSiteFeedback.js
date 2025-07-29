const groupFeedbackBySite = (feedbackList) => {
  return feedbackList.reduce((acc, feedback) => {
    const site = feedback.site || 'Unknown';
    if (!acc[site]) acc[site] = [];
    acc[site].push(feedback);
    return acc;
  }, {});
};

module.exports = { groupFeedbackBySite };