// let str ;
import getInnerText from "./getInnerText.tsx"
export default function checkHeaders(htmlInput: HTMLElement, keyArray: string[]) {
    // console.log(htmlInput);
    let objReturn = {
        title: 'Headers',
        content: 'No content given',
    };
    // console.log(keyArray);
    if (!htmlInput || keyArray === null) return objReturn;
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    let outputString = '';
    let headerTags = Array.from(htmlInput.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    // console.log(headerTags);
    const tempObj = filtertags(headerTags, outputString);
    headerTags = tempObj.headerTags// will remove all the header tags which do not have any content in it
    outputString = tempObj.outputString;
    if (headerTags.length === 0) {
        outputString = giveSuggestion(`No headings in the content%`, outputString);// red
        objReturn.content = outputString;
        return objReturn;
    }
    // check for the first header tag in the content , if it is not h1 then , else report
    if (headerTags[0].tagName != "H1") {
        outputString = giveSuggestion(`It is advised to have content's first heading as h1 , You have ${headerTags[0].tagName} ${getInnerText(headerTags[0].innerHTML)}.%`, outputString);// red
    }
    // check for number of h1 heading in the content , if it is more than 1 report 
    const cntH1TagsObj = countH1Tags(headerTags, outputString);
    outputString = cntH1TagsObj.string;
    // take the first heading and check for the keywords assuming that first heading is h1 , if it is not we have already reported above
    const keywordsHeadingObj = checkForKeywordsHeading(headerTags[0], keyArray, outputString);
    outputString = keywordsHeadingObj.string;
    // check for proper heirarchy , can be done in a section/div/ or a wrapping element - will do
    const heirarchyObj = checkForHeirarchy(headerTags, outputString);
    outputString = heirarchyObj.string;
    if (!outputString) {
        outputString = giveSuggestion('All okay with the header tags.%', outputString);
    }
    objReturn.content = outputString;
    return objReturn;
}
function filtertags(headerTags: Element[], outputString: string) {

    interface TempObj {
        headerTags: Element[];
        outputString: string;
    }
    let tempObj: TempObj = {
        headerTags: [],
        outputString: '',
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
    tempObj.outputString = outputString;
    return tempObj;
}
function countH1Tags(headerTags: Element[], outputString: string) {

    let cnth1: number = 0;
    for (let tag of headerTags) {
        if (parseInt(tag.tagName.charAt(1)) == 1) {
            cnth1++;
        }
    }
    if (cnth1 > 1) {
        outputString = giveSuggestion(`It is advised to have only 1 H1 tag in a page as having multiple H1 tags can make it difficult for search engines and users to understand the main topic of the page.%`, outputString);// yellow
    }
    return { string: outputString};
}
function checkForKeywordsHeading(firstHeaderTag: Element, keyArray: string[], outputString: string) {

    if (firstHeaderTag === null) return { string: outputString};
    const Heading = firstHeaderTag.childNodes[0]?.textContent?.trim() ?? "";
    if (Heading.length > 60) {
        outputString = giveSuggestion(`Please try to reduce the length of your heading as search engines will truncate headings that are longer than 60 characters%`, outputString);// yellow
    }
    // checking for count of keywords in the array 
    const headingArray = Heading.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
    let anyKeywordHeading: boolean = false;
    keyArray.forEach((element) => {
        let allWords = element.split(' ');
        anyKeywordHeading = searchExactArrayOrder(allWords,headingArray);
    });
    if (!anyKeywordHeading) {
        outputString = giveSuggestion(`Please try to add some keywords in the heading because they help search engines understand the content of your page.%`, outputString);// yellow
    }
    return { string: outputString}
}
function checkForHeirarchy(headerTags: Element[], outputString: string) {
    // console.log('anshul');
    let countHeader = [1, 0, 0, 0, 0, 0, 0];
    let currentScore = 0;
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
        allLevelCheck = `${allLevelCheck} tag above this tag.%`;
        if (anyError) {
            const headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
            outputString = giveSuggestion(`Hierarchy incosistency found for the header ${headerText}%`, outputString);// transparent
            currentScore += 5;
            outputString = giveSuggestion(allLevelCheck, outputString);// yellow
        }
    }
    return { string: outputString};
}
function giveSuggestion(text: string, outputHtmlString: string) {
    outputHtmlString = `${outputHtmlString}${text}`;
    return outputHtmlString;
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