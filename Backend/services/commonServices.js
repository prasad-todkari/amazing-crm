const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateQrServices = async ({ url, locationId }) => {
  if (!url || !locationId) {
    throw new Error('URL and locationId are required');
  }

  try {
    const qrBuffer = await QRCode.toBuffer(url, {
      width: 400,
      errorCorrectionLevel: 'H'
    });

    const folderPath = path.join(__dirname, 'qr-codes'); // Make sure this folder exists or create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filename = `${locationId}-${Date.now()}.png`;
    const filePath = path.join(folderPath, filename);

    fs.writeFileSync(filePath, qrBuffer);

    // Return local file path or URL if you're serving the folder statically
    return filePath;

  } catch (error) {
    console.error('QR generation error:', error.message);
    throw new Error('Failed to generate and save QR code');
  }
};

const getQrCodeServices = async (siteId) => {
  try {
    const folderPath = path.join(__dirname, 'qr-codes');
    const files = fs.readdirSync(folderPath);

    // Filter only QR codes related to the given siteId
    const matchingFiles = files.filter(file => file.startsWith(`${siteId}-`));

    const filePaths = matchingFiles.map(file => path.join(folderPath, file));

    return {
      message: `QR codes for location ${siteId}`,
      data: filePaths,
    };

  } catch (error) {
    console.error('QR fetch error:', error.message);
    throw new Error('Failed to fetch local QR codes');
  }
};

module.exports = {
  generateQrServices,
  getQrCodeServices
};
