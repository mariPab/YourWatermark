const Jimp = require('jimp');

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };

    image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
    image.quality(100).write(outputFile);
};

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);

    image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5,
    });
    image.quality(100).write(outputFile);
};

addTextWatermarkToImage('./test.png', './test-with-watermark.jpg', 'Hello World');
addImageWatermarkToImage('./test.png', './test-with-watermarkImage.jpg', './logo.png');