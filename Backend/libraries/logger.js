const fs = require('fs');
const path = require('path');

// Define the path for the log file
const logFilePath = path.join(__dirname, 'Log.txt');

/**
 * Logs a message to the log file.
 * @param {string} message - The message to log.
 * @param {string} [level='INFO'] - The log level (e.g., INFO, ERROR, etc.).
 */
const 
logMessage = (message, level = 'INFO') => {
  const logEntry = `${new Date().toISOString()} - [${level}] - ${message}\n`;
  // Append the log entry to the log file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } 
  });
};

// Example usage
//logMessage('This is a test log message', 'INFO');

module.exports = {
  logMessage,
};