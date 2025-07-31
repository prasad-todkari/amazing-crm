const sharp = require('sharp');

const optimizeImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .resize({ width: 1024 }) // Resize to max 1024px wide
    .jpeg({ quality: 80 })   // Compress
    .toFile(outputPath);     // Save optimized version
};

module.exports = { optimizeImage };