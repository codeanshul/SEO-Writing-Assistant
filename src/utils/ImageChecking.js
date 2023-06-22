import imageCompression from "browser-image-compression";
export default function checkOptimizedImagesWithAlt(htmlInput, inputNum) {

    const images = htmlInput.querySelectorAll('img');
    // console.log(images);
    if (images.length == 0) {
        giveSuggestion(`<p>No images in the article . Please add some relevant image so that results can become much more useful </p> `);
        return;
    }
    for (let img of images) {
        const altText = img.getAttribute('alt');
        const src = img.getAttribute('src');
        checkImageSrc(src)
            .then((isImageValid) => {
                if (!isImageValid) return;
                checkValidImage(img,src, altText);
            })
            .catch((error) => {
                return;
            });
    }
}
function checkValidImage(img,src, altText) {
    giveSuggestion(`<h3>Image check for the image </u>   <a href = ${src}> Img </h3> `);
    let anyError = false;
    if (!altText) {
        giveSuggestion(`<p>Image without alt attribute:</p> `);
        anyError = true;
    }
    if (!getImageFormatFromURL(src)) {
        giveSuggestion(`<p>Please prefer taking recommended image format jpeg , png , webp </p> `);
        anyError = true;
    }
    if (checkImageCompression(src)) {
        giveSuggestion(`<p> Image can be further compressed. </p> `);
        anyError = true;
    }
    if (hasCrypticCode(src)) {
        giveSuggestion(`<p>Please make the src link of the image a little descriptive</p> `);
        anyError = true;
    }
    if (!isLazyLoadEnable(img)) {
        giveSuggestion(`<p> Please make the loading attribute of this image as lazy for better loading time of the page`);
    }
    if (!anyError) {
        giveSuggestion(`<p>Image has all required attributes for a good SEO recommended page</p> `);
    }
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

// Usage example
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
function giveSuggestion(text) {
    let ImageSection = document.getElementById(`Image`);
    ImageSection.insertAdjacentHTML('beforeend', text);
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