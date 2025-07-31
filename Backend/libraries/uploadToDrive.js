const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: 'your-service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

const uploadToDrive = async (filePath, fileName, mimeType = 'image/jpeg') => {
  const media = {
    mimeType,
    body: fs.createReadStream(filePath)
  };

  const res = await drive.files.create({
    requestBody: { name: fileName },
    media,
    fields: 'id, webViewLink, webContentLink'
  });

  return res.data;
};

module.exports = { uploadToDrive };