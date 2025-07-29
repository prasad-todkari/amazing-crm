const { generateQrServices } = require("../services/commonServices");


const generateQRController = async (rec, res) => {
    const { url, locationId } = rec.body;
    console.log(url, locationId)
    try {
        const createQR = await generateQrServices({url, locationId})
        res.status(200).json({
            qrUrl: createQR,
            locationId,
            generatedAt: new Date().toISOString()
        })
        console.log(createQR)
    } catch (error) {
        console.log(error.message)
    }
    console.log('new request Received');
}

module.exports = {
    generateQRController
}