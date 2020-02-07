const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

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
    console.log('Picture has been succesfully created and saved');
};

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5,
    });
    image.quality(100).write(outputFile);
    console.log('Picture has been succesfully created and saved');
};

const prepareOutputFilename = fullFileName => {
    const [name, extension] = fullFileName.split('.');
    return `${name}-with-watermark.${extension}`
};

const startApp = async () => {
    const answer = await inquirer.prompt([{
        name: 'start',
        message: 'Hi! Welcome to YourWatermark Manager. Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
        type: 'confirm',
    }]);

    if (!answer.start) process.exit();
    const options = await inquirer.prompt([{
        name: 'inputImage',
        type: 'input',
        message: 'What file do you want to mark?',
        default: 'test.png',
    }, {
        name: 'watermarkType',
        type: 'list',
        choices: ['Text watermark', 'Image Watermark'],
    }]);

    if (options.watermarkType === 'Text watermark') {
        const text = await inquirer.prompt([{
            name: 'value',
            type: 'input',
            message: 'Type your watermark text',
        }]);
        options.watermarkText = text.value;

        if (fs.existsSync('./img/' + options.inputImage)) {
            addTextWatermarkToImage('./img/' + options.inputImage, `./${prepareOutputFilename(options.inputImage)}`, options.watermarkText)
        } else {
            console.log('Something went wrong... Try again');
            process.exit();
        }
    } else {
        const image = await inquirer.prompt([{
            name: 'filename',
            input: 'input',
            message: 'Type your watermark here',
            default: 'logo.png'
        }]);
        options.watermarkImage = image.filename;
        if (fs.existsSync('./img/' + options.inputImage) || fs.existsSync('./img/' + options.watermarkImage)) {
            addImageWatermarkToImage('./img/' + options.inputImage, `./${prepareOutputFilename(options.inputImage)}`, './img/' + options.watermarkImage);
        } else {
            console.log('Something went wrong... Try again');
            process.exit();
        }
    }
};

startApp();

