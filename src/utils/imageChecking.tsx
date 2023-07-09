import imageCompression from "browser-image-compression";
export default async function checkOptimizedImagesWithAlt(htmlInput: HTMLElement) {
    let objReturn = {
        title: 'Images',
        content: "Loading Page....",
    }
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    let outputString : string = '';
    const images = htmlInput.querySelectorAll('img');
    if (images.length == 0) {
        outputString = giveSuggestion(`No images in the article , Please add some relevant image so that results can become much more useful%`, outputString);// yellow
        objReturn.content = outputString;
        return objReturn;
    }
    let itemProcessed : number = 0;
    for (let img of images) {
        let altText = img.getAttribute('alt');
        if (altText === null && altText == undefined) altText = '';
        const src = img.getAttribute('src') || '';
        const isImageValid = await checkImageSrc(src);
        itemProcessed++;
        if (isImageValid) {
            const checkImageObj = await checkImage(img, src, altText, outputString);
            outputString = checkImageObj.string;
        }
        else {
            console.log(`Not able to process this image ${src}`);
            outputString = giveSuggestion(`Not able to process this image ${src}%`, outputString);
        }
        if (itemProcessed == images.length) {
            objReturn.content = outputString;
            return objReturn;
        }
    }
    return objReturn;
}
async function checkImage(img: Element, src: string, altText: string, outputString: string) {

    let imageTitle: string = altText;
    if (hasOnlyWhitespaceContentOrNULL(altText)) imageTitle = 'IMG';
    outputString = giveSuggestion(`Image check for the image ${src}randommm${imageTitle}%`, outputString);// transparent
    const format = getImageFormatFromURL(src);
    const possibleExtension = ['bmp', 'gif', 'jpeg', 'png', 'webp', 'svg'];
    let anyError = false;
    const data = await checkImageCompression(src);
    const dataImageCompress = data && data.isCompressed;
    // image compression
    if (dataImageCompress) {
        let totalCompress = data.originalSize - data.compressSize;
        outputString = giveSuggestion(`Image can be further compressed , Potential savings upto : ${totalCompress} KB.%`, outputString);// yellow
        anyError = true;
    }
    // format check
    if (!possibleExtension.includes(format)) {
        outputString = giveSuggestion(`Google Images supports images in the following formats: BMP, GIF, JPEG, PNG, WebP, and SVG but your format is ${format}.%`, outputString);// yellow
        anyError = true;
    }
    if ((format == 'png' || format == 'jpeg')) {
        outputString = giveSuggestion(`Please use image formats like WebP and AVIF as they often provide better compression than your format ${format}, which means faster downloads and less data consumption.%`, outputString);
        anyError = true;
    }
    // alt text check
    if (hasOnlyWhitespaceContentOrNULL(altText)) {
        outputString = giveSuggestion(`Add alt attribute for the image as it helps crawler to better understand what the image is about.%`, outputString);// yellow
        anyError = true;
    }
    // src link secured with http protocol
    if (!isSecure(src)) {
        outputString = giveSuggestion('Src link of the image is not secured with http protocol.%', outputString);// yellow
        anyError = true;
    }
    // enable loading attribute as lazy 
    if (!isLazyLoadEnable(img)) {
        outputString = giveSuggestion(`Please make the loading attribute of this image as lazy for better loading time of the page.%`, outputString);// yellow
    }
    if (!anyError) {
        outputString = giveSuggestion(`Image has all required attributes for a good SEO recommended page.%`, outputString);// green
    }
    // console.log(score);
    return { string: outputString};
}
function checkImageSrc(imageUrl: string) {
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
function isLazyLoadEnable(img: Element) {
    const attributeValue = img.getAttribute('loading');
    if (attributeValue === null) return false;
    if (attributeValue != 'lazy') return false;
    return true;
}
async function checkImageCompression(imageUrl: any) {
    interface ObjReturn {
        isCompressed: boolean;
        compressSize: number;
        originalSize: number;
    }
    let objReturn: ObjReturn = {
        isCompressed: false,
        compressSize: 0,
        originalSize: 0,
    };
    try {
        const format = imageUrl.split('.').pop().toLowerCase();
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], `image.${format}`, { type: `image/${format}` });

        const options = {
            maxSizeMB: 1, // Set the maximum file size limit for compression in megabytes
            useWebWorker: true // Enable web worker for faster compression (optional)
        };
        const compressedFile = await imageCompression(file, options);
        const isCompressed = compressedFile.size < file.size;
        // console.log(compressedFile.size,file.size);
        if (isCompressed) {
            console.log('Image can be further compressed.');
            console.log(compressedFile.size);
            console.log(file.size);
            objReturn.isCompressed = isCompressed;
            objReturn.compressSize = compressedFile.size;
            objReturn.originalSize = file.size;
            return objReturn;
        }
        else {
            return objReturn;
        }
    } catch (error) {
        console.error('Error occurred while fetching the image:', error);
        return false;
    }
}
function isSecure(src: string) {
    if(src.startsWith('./'))return true;
    const url = new URL(src);
    return url.protocol.startsWith('http');
}
function getImageFormatFromURL(url: string) {
    const possibleExtension = ['bmp', 'gif', 'jpeg', 'png', 'webp', 'svg','avif','jpg'];
    const extension = url.split('.').pop()?.toLowerCase() ?? '';
    const formatMatch = url.match(/^data:image\/(\w+);base64,/);
    if (!formatMatch){
        if(!possibleExtension.includes(extension))return 'Unknown Format';
        return extension;
    }
    return formatMatch[1];
}
function hasOnlyWhitespaceContentOrNULL(element: string) {
    if (element === undefined) return true;
    if (element === null) return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
function giveSuggestion(text: string, outputString: string) {
    outputString = `${outputString}${text}`;
    return outputString;
}
