import imageCompression from "browser-image-compression";
export default function checkOptimizedImagesWithAlt(htmlInput) {

    let objReturn = {
        title: `<h3> Image checking </h3>`,
        content: "No Content Given"
    }
    if (htmlInput === '') return objReturn;
    let outputString = '';
    const images = htmlInput.querySelectorAll('img');
    // console.log(images);
    if (images.length == 0) {
        outputString = giveSuggestion(`<p>No images in the article . Please add some relevant image so that results can become much more useful </p> `, outputString);
        objReturn.content = outputString;
        return objReturn;
    }
    let itemProcessed = 0;
    // console.log(images.length);
    for (let img of images) {
        const altText = img.getAttribute('alt');
        const src = img.getAttribute('src');
        checkImageSrc(src)
            .then((isImageValid) => {
                itemProcessed++;
                if(isImageValid)outputString = checkImage(img, src, altText, outputString);
                else console.log(`Not able to process this image ${src}`);
                // console.log(itemProcessed);
                if (itemProcessed == images.length) {
                    console.log(itemProcessed);
                    objReturn.content = outputString;
                    return objReturn;
                }
            })
            .catch((error) => {
                itemProcessed++;
                // console.log(`Not able to process this image ${src}`);
            });
    }
    return objReturn;
}
function checkImage(img, src, altText, outputString) {

    // let allErrorCheck = '';
    outputString = giveSuggestion(`<h4>Image check for the image </u>   <a href = ${src}> Img </a> </h4> `, outputString);
    let anyError = false;
    if (!altText) {
        outputString = giveSuggestion(`<li>Image without alt attribute:</li> `, outputString);
        anyError = true;
    }
    if (!getImageFormatFromURL(src)) {
        outputString = giveSuggestion(`<li>Please prefer taking recommended image format jpeg , png , webp </li> `, outputString);
        anyError = true;
    }
    if (checkImageCompression(src)) {
        outputString = giveSuggestion(`<li> Image can be further compressed. </li> `, outputString);
        anyError = true;
    }
    if (hasCrypticCode(src)) {
        outputString = giveSuggestion(`<li>Please make the src link of the image a little descriptive</li> `, outputString);
        anyError = true;
    }
    if (!isLazyLoadEnable(img)) {
        outputString = giveSuggestion(`<li> Please make the loading attribute of this image as lazy for better loading time of the page </li>`, outputString);
    }
    if (!anyError) {
        outputString = giveSuggestion(`<li>Image has all required attributes for a good SEO recommended page</li> `, outputString);
    }
    return outputString;
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
    let attributeValue = img.getAttribute('loading');
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
        imageCompression(file, options)
            .then((compressedFile) => {
                console.log(compressedFile.size);
                console.log(file.size);
                const isCompressed = compressedFile.size < file.size;
                if (isCompressed) {
                    console.log('Image can be further compressed.');
                    return true;
                } else {
                    console.log('Image is already optimally compressed.');
                    return false;
                }
            })
            .catch((error) => {
                console.error('Error occurred while checking image compression:', error);
                return false;
            });
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
    const possibleExtension = ['jpeg', 'png', 'webp'];
    if (!possibleExtension.includes(extension)) {
        // console.log(`Please prefer taking recommended image format jpeg , png , webp`);
        return false;
    }
    return true;
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