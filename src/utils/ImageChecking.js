import imageCompression from "browser-image-compression";
export default async function checkOptimizedImagesWithAlt(htmlInput){

    let objReturn = {
        title: 'Images',
        content: "Loading Page....",
        score: 0
    }
    //return objReturn;
    if (htmlInput === '') return objReturn;
    let outputString = '';
    const images = htmlInput.querySelectorAll('img');
    if (images.length == 0) {
        outputString = giveSuggestion(`No images in the article , Please add some relevant image so that results can become much more useful%`, outputString);// yellow
        objReturn.content = outputString;
        return objReturn;
    }
    let itemProcessed = 0;
    let totImagesScore = images.length * 100;
    for (let img of images) {
        let altText = img.getAttribute('alt');

        if(altText === null && altText == undefined)altText = '';
        // console.log(altText);
        const src = img.getAttribute('src');
        const isImageValid = await checkImageSrc(src);
        itemProcessed++;
        if (isImageValid) {
            let checkImageObj = await checkImage(img, src, altText, outputString, totImagesScore);
            outputString = checkImageObj.string;
            totImagesScore = checkImageObj.src;
        }
        else {
            console.log(`Not able to process this image ${src}`);
            totImagesScore -= 100;
            outputString = giveSuggestion(`Not able to process this image ${src}%`, outputString);
        }
        if (itemProcessed == images.length) {
            objReturn.content = outputString;
            // console.log(totImagesScore);
            objReturn.score = (totImagesScore / images.length) * 0.25;
            return objReturn;
        }
    }
    return objReturn;
}
async function checkImage(img, src, altText, outputString, score) {

    // let allErrorCheck = '';
    // console.log(altText);
    let imageTitle = altText;
    if(hasOnlyWhitespaceContentOrNULL(altText))imageTitle = 'IMG';
    outputString = giveSuggestion(`Image check for the image ${src}randommm${imageTitle}%`, outputString);// transparent
    const format = getImageFormatFromURL(src);
    const possibleExtension = ['bmp', 'gif', 'jpeg', 'png', 'webp', 'svg'];
    let anyError = false;
    const data = await checkImageCompression(src);
    if(data.isCompressed)
    {
        score -= 20;
        outputString = giveSuggestion(`Image can be further compressed , Actual Image size : ${data.originalSize} Compressed Image Size : ${data.compressSize}%`, outputString);// yellow
        anyError = true;
    }
    if (!possibleExtension.includes(format)) {
        // 20
        score -= 20;
        outputString = giveSuggestion(`Google Images supports images in the following formats: BMP, GIF, JPEG, PNG, WebP, and SVG%`, outputString);// yellow
        anyError = true;
    }
    if (format != 'avif' && format != 'webp') {
        // 10
        score -= 10;
        outputString = giveSuggestion(`Image formats like WebP and AVIF often provide better compression than PNG or JPEG, which means faster downloads and less data consumption.%`, outputString);
        anyError = true;
    }
    if (hasOnlyWhitespaceContentOrNULL(altText)) {
        // 30
        score -= 30;
        console.log('anshul');
        outputString = giveSuggestion(`Add alt attribute for the image as it helps crawler to better understand what the image is about%`, outputString);// yellow
        anyError = true;
    }
    if (hasCrypticCode(src)) {
        // 10
        score -= 10;
        outputString = giveSuggestion('Src link of the image shoulld be descriptive as it can help user understand what they can expect when they click on it%', outputString);// yellow
        anyError = true;
    }
    if (!isLazyLoadEnable(img)) {
        // 10
        score -= 10;
        outputString = giveSuggestion(`Please make the loading attribute of this image as lazy for better loading time of the page%`, outputString);// yellow
    }
    if (!anyError) {
        outputString = giveSuggestion(`Image has all required attributes for a good SEO recommended page%`, outputString);// green
    }
    // console.log(score);
    return { string: outputString, src: score };
}
function checkImageSrc(imageUrl) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            // Image loaded successfully
            resolve(true);
        };
        image.onerror = () => {
            // Error loading the image
            resolve(false);
        };
        image.src = imageUrl;
    });
};
function isLazyLoadEnable(img) {
    const attributeValue = img.getAttribute('loading');
    if (attributeValue === null) return false;
    if (attributeValue != 'lazy') return false;
    return true;
}
async function checkImageCompression(imageUrl) {
    try {
        const format = imageUrl.split('.').pop().toLowerCase();
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], `image.${format}`, { type: `image/${format}` });

        const options = {
            maxSizeMB: 1, // Set the maximum file size limit for compression in megabytes
            useWebWorker: true // Enable web worker for faster compression (optional)
        };
        const compressedFile = await imageCompression(file,options);
        const isCompressed = compressedFile.size < file.size;
        if(isCompressed){
            console.log('Image can be further compressed.');
            console.log(compressedFile.size);
            console.log(file.size);
            return {isCompressed : isCompressed , compressSize: compressedFile.size, originalSize: file.size };
        }
        else {
            return false;
        }
    } catch (error) {
        console.error('Error occurred while fetching the image:', error);
        return false;
    }
}
function hasCrypticCode(src) {
    const crypticCodeRegex = /[^\w\d\-_]/; // Regular expression to match any character that is not a word character, digit, hyphen, or underscore
    return crypticCodeRegex.test(src);
}
function getImageFormatFromURL(url) {
    const extension = url.split('.').pop().toLowerCase();
    const formatMatch = url.match(/^data:image\/(\w+);base64,/);
    if(!formatMatch)return extension;
    return formatMatch[1];
}
function hasOnlyWhitespaceContentOrNULL(element) {
    if(element === undefined)return true;
    if (element === null ) return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
function giveSuggestion(text, outputString) {

    outputString = `${outputString}${text}`;
    return outputString;
}
// alt text check - done
// check for number of images -> Done
// check the size of the image for better loading of page - Done
// Also we can check for recommmend format of the images . Google advices to use these image format - Done 
// Can check for aspect ratio of the image (height to width ratio that should be 1:1 mostly)
// Also include a check for PPI(Pixels per inch) . Ideally it should be 72 . If less than it then report. Generally for printable images
// Descriptive src link for better recognition of your page by crawler - Done


//git branch -M main
// git remote add origin https://github.com/codeanshul/SEO-Checker-Tool.git
// git push -u origin main

