// let str ;
import { ReactNode } from "react";
import getInnerText from "./getInnerText.tsx"
import React from "react";
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
export default function checkHeaders(htmlInput: HTMLElement, keyArray: string[]) {
    // console.log(htmlInput);
    let objReturn : ObjReturn = {
        title: 'Headers',
        content: [],
    };
    // console.log(keyArray);
    if (!htmlInput || keyArray === null) return objReturn;
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    else if (keyArray.length === 1 && keyArray[0] === '') {
        objReturn.content.push({
            str : <> No keywords given </>,
            warning : 'big-header-warning' ,
            iconWarning : 'icon-high-warning' ,
            type : 'p',
        });
        return objReturn;
    }
    let outputArray : outputObject[] = [];
    // let outputArray : ReactNode[] = [];
    let headerTags = Array.from(htmlInput.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const tempObj = filtertags(headerTags);
    headerTags = tempObj.headerTags;// will remove all the header tags which do not have any content in it
    if (headerTags.length === 0) {
        outputArray.push({
            str : <>No headings in the content</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'p',
        });// red
        objReturn.content = outputArray;
        return objReturn;
    }
    // check for the first header tag in the content , if it is not h1 then , else report
    if (headerTags[0].tagName != "H1") {
        outputArray.push({
            str : <>It is advised to have content's first heading as h1 , You have <i>{getInnerText(headerTags[0].innerHTML)}</i> as {headerTags[0].tagName}</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'p',
        });
    }
    // check for number of h1 heading in the content , if it is more than 1 report 
    outputArray = countH1Tags(headerTags, outputArray);
    // take the first heading and check for the keywords assuming that first heading is h1 , if it is not we have already reported above
    outputArray = checkForKeywordsHeading(headerTags[0], keyArray, outputArray);
    // check for proper heirarchy , can be done in a section/div/ or a wrapping element - will do
    outputArray = checkForHeirarchy(headerTags, outputArray);
    if (outputArray.length === 0) {
        outputArray.push({
            str : <>All okay with header tags</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-no-warning',
            type : 'p',
        });
    }
    objReturn.content = outputArray;
    return objReturn;
}
function filtertags(headerTags: Element[]) {

    interface TempObj {
        headerTags: Element[];
    }
    let tempObj: TempObj = {
        headerTags: [],
    };
    let contenttags: Element[] = [];
    for (let i = 0; i < headerTags.length; i++) {
        const tag = headerTags[i].tagName;
        const headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
        if (headerText.length == 0 || headerText.length == 1) {
            console.log("Empty Header tag");
        }
        else {

            contenttags.push(headerTags[i]);
        }
    }
    tempObj.headerTags = contenttags;
    return tempObj;
}
function countH1Tags(headerTags: Element[], outputArray : outputObject[]) {

    let cnth1: number = 0;
    for (let tag of headerTags) {
        if (parseInt(tag.tagName.charAt(1)) == 1) {
            cnth1++;
        }
    }
    if (cnth1 > 1) {
        outputArray.push({
            str : <>It is advised to have only 1 H1 tag in a page as having multiple H1 tags can make it difficult for search engines and users to understand the main topic of the page.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'p',
        });
    }
    return outputArray;
}
function checkForKeywordsHeading(firstHeaderTag: Element, keyArray: string[], outputArray : outputObject[]) {

    if (firstHeaderTag === null) return outputArray;
    const Heading = firstHeaderTag.childNodes[0]?.textContent?.trim() ?? "";
    if (Heading.length > 60) {
        outputArray.push({
            str : <>Please try to reduce the length of your heading as search engines will truncate headings that are longer than 60 characters</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'p',
        });
    }
    // checking for count of keywords in the array 
    const headingArray = Heading.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
    let anyKeywordHeading: boolean = false;
    keyArray.forEach((element) => {
        let allWords = element.split(' ');
        anyKeywordHeading = searchExactArrayOrder(allWords,headingArray);
    });
    if (!anyKeywordHeading) {
        outputArray.push({
            str : <>Please try to add some keywords in the heading because they help search engines understand the content of your page.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'p',
        });
    }
    return outputArray;
}
function checkForHeirarchy(headerTags: Element[], outputArray : outputObject[]) {
    // console.log('anshul');
    let countHeader = [1, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < headerTags.length; i++) {

        const currTag = headerTags[i];
        const level = parseInt(currTag.tagName.charAt(1));
        countHeader[level]++;
        if (level == 1) continue;
        let anyError = false;
        let allLevelCheck = 'There should be atleast one';
        for (let j = 1; j < level; j++) {
            if (countHeader[j] == 0) {
                allLevelCheck = `${allLevelCheck} h${j}`;
                anyError = true;
            }
        }
        allLevelCheck = `${allLevelCheck} tag above this tag.`;
        if (anyError) {
            const headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
            outputArray.push({
                str : <>Hierarchy incosistency found for the header <i>{headerText}</i></>,
                warning : 'big-header-warning',
                iconWarning : '',
                type : 'ul',
            });
            outputArray.push({
                str : <>{allLevelCheck}</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
    }
    return outputArray;
}
function hasOnlyWhitespaceContent(element: Element) {
    if (element == null) return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent?.trim() ?? "";// check by using length on trim
    return whitespaceRegex.test(content);
}
function searchExactArrayOrder(longTailArray: string[], headingArray: string[]) {
    const longTailArrayLength = longTailArray.length;
    const headingArrayLength = headingArray.length;
    if (longTailArrayLength > headingArrayLength) {
        return false; // Small array is longer than the big array
    }
    let keyIndex = 0;
    for (let i = 0; i < headingArrayLength; i++) {
        if (headingArray[i] === longTailArray[keyIndex]) {
            keyIndex++;

            if (keyIndex === longTailArrayLength) {
                return true; // Found the exact small array in order
            }
        }
    }
    return false; // Small array not found in the big array in the exact order
}
