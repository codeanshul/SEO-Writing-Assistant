import imageCompression from "browser-image-compression";
import { ImageDisplay } from "src/imageDisplay";
import React from "react";
import {ReactNode} from 'react';
interface outputObject{
    str : ReactNode;
    warning : string;
    iconWarning : string;
    type : string;
}
interface ObjReturn{
    title : string;
    content : outputObject[];
}
export default async function checkOptimizedImagesWithAlt(htmlInput: HTMLElement) {
    
    let objReturn : ObjReturn = {
        title: 'Images',
        content: [],
    };
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    let outputArray : outputObject[] = [];
    const images = htmlInput.querySelectorAll('img');
    if (images.length == 0) {
        outputArray.push({
            str : <>No images in the article , Please add some relevant image so that results can become much more useful</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'p',
        });
        objReturn.content = outputArray;
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
            outputArray = await checkImage(img, src, altText, outputArray);
        }
        else {
            console.log(`Not able to process this image ${src}`);
            outputArray.push({
                str : <>Not able to process this image {src}</>,
                warning : 'big-header-warning',
                iconWarning : 'icon-high-warning',
                type : 'p',
            });
        }
        if (itemProcessed == images.length) {
            objReturn.content = outputArray;
            return objReturn;
        }
    }
    return objReturn;
}
async function checkImage(img: Element, src: string, altText: string, outputArray : outputObject[]) {

    let imageTitle: string = altText;
    if (hasOnlyWhitespaceContentOrNULL(altText)) imageTitle = 'IMG';
    outputArray.push({
        str : <>Image check for the image <ImageDisplay src = {src} altText={imageTitle} /></>,
        warning : 'big-header-warning',
        iconWarning : '',
        type : 'ul',
    });
    const format = getImageFormatFromURL(src);
    const possibleExtension = ['bmp', 'gif', 'jpeg', 'png', 'webp', 'svg'];
    let anyError = false;
    const data = await checkImageCompression(src);
    const dataImageCompress = data && data.isCompressed;
    // image compression
    if (hasOnlyWhitespaceContentOrNULL(altText)) {
        outputArray.push({
            str : <span> <b>Add alt attribute </b>for the image as it helps crawler to better understand what the image is about.</span>,
            warning : '',
            iconWarning : 'icon-high-warning',
            type : 'li',
        });
        anyError = true;
    }
    if (!isLazyLoadEnable(img)) {
        outputArray.push({
            str : <span>Please make the <b>loading attribute</b> of this image as lazy for better loading time of the page.</span>,
            warning : '',
            iconWarning : 'icon-high-warning',
            type : 'li',
        });
        anyError = true;
    }
    if (dataImageCompress) {
        let totalCompress = data.originalSize - data.compressSize;
        outputArray.push({
            str : <span>Image <b>can be further compressed </b>, Potential savings upto : <b>{totalCompress} KB.</b></span>,
            warning : '',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
        anyError = true;
    }
    // format check
    if (!possibleExtension.includes(format)) {
        outputArray.push({
            str : <span>Google Images supports images in the following formats: BMP, GIF, JPEG, PNG, WebP, and SVG but your format is <i>{format}</i>.</span>,
            warning : '',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
        anyError = true;
    }
    if ((format == 'png' || format == 'jpeg')) {
        outputArray.push({
            str : <span>Please <b>use image formats like WebP and AVIF </b>as they often provide better compression than your format <i>{format}</i> , which means faster downloads and less data consumption.</span>,
            warning : '',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
        anyError = true;
    }
    // alt text check
    // src link secured with http protocol
    if (!isSecure(src)) {
        outputArray.push({
            str : <>Src link of the image is not secured with https protocol.</>,
            warning : '',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
        anyError = true;
    }
    // enable loading attribute as lazy 
    if (!anyError) {
        outputArray.push({
            str : <>Image has all required attributes for a good SEO recommended page.</>,
            warning : '',
            iconWarning : 'icon-no-warning',
            type : 'li',
        });
    }
    // console.log(score);
    return outputArray;
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
        if(!possibleExtension.includes(extension))return 'Unknown';
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

