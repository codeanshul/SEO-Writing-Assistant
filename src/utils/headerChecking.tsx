// let str ;
import getInnerText from "./getInnerText.tsx"
export default function checkHeaders(htmlInput : HTMLElement, keyArray : string[]) {
    // console.log(htmlInput);
    let objReturn = {
        title: 'Headers',
        content: 'No content given',
        score: 0,
    };
    if(!htmlInput || keyArray === null)return objReturn;
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    let outputString = '';
    let headerTags = Array.from(htmlInput.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    // console.log(headerTags);
    const tempObj = filtertags(headerTags,outputString);
    headerTags = tempObj.headerTags// will remove all the header tags which do not have any content in it
    outputString = tempObj.outputString;
    let score = 100;
    if (headerTags.length === 0) {
        // 10
        // console.log('Hello');
        outputString = giveSuggestion(`No headings in the content%`,outputString);// red
        score -= 10;
        objReturn.content = outputString;
        objReturn.score = score*0.2;
        return objReturn;
    }
    // check for the first header tag in the content , if it is h1 then , else report
    if (headerTags[0].tagName != "H1") {
        // 25
        score -= 25;
        outputString = giveSuggestion(`It is advised to have content's first heading as h1 , You have ${headerTags[0].tagName}.%`,outputString);// red
    }
    // check for number of h1 heading in the content , if it is more than 1 report 
    const cntH1TagsObj = countH1Tags(headerTags,outputString,score);
    outputString = cntH1TagsObj.string;
    score = cntH1TagsObj.scr;
    // take the first heading and check for the keywords assuming that first heading is h1 , if it is not we have already reported above
    const keywordsHeadingObj = checkForKeywordsHeading(headerTags[0], keyArray,outputString,score);
    outputString = keywordsHeadingObj.string;
    score = keywordsHeadingObj.scr;
    // check for proper heirarchy , can be done in a section/div/ or a wrapping element - will do
    const heirarchyObj = checkForHeirarchy(headerTags,outputString,score);
    outputString = heirarchyObj.string;
    if(!outputString){
        outputString = giveSuggestion('All okay with the header tags.%',outputString);
    }
    score = heirarchyObj.scr;
    objReturn.content = outputString;
    objReturn.score = score*0.2;
    return objReturn;
}
function filtertags(headerTags : Element[],outputString : string) {

    interface TempObj{
        headerTags : Element[];
        outputString : string;
    }
    let tempObj : TempObj = {
        headerTags : [],
        outputString : '',
    };
    let contenttags : Element[] = [];
    for (let i = 0; i < headerTags.length; i++) {
        const tag = headerTags[i].tagName;
        const headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
        if(headerText.length == 0 || headerText.length == 1){
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
function countH1Tags(headerTags : Element[],outputString : string,score : number) {

    let cnth1 : number = 0;
    for (let tag of headerTags) {
        if (parseInt(tag.tagName.charAt(1)) == 1) {
            cnth1++;
        }
    }
    if (cnth1 > 1) {
        //15
        score -= 15;
        outputString = giveSuggestion(`It is advised to have only 1 H1 tag in a page as having multiple H1 tags can make it difficult for search engines and users to understand the main topic of the page.%`,outputString);// yellow
    }
    return {string : outputString , scr : score};
}
function checkForKeywordsHeading(firstHeaderTag : Element, keyArray : string[],outputString : string,score : number) {

    if(firstHeaderTag === null)return {string : outputString , scr : score};
    const Heading = firstHeaderTag.childNodes[0]?.textContent?.trim() ?? "";
    let currentScore : number = 0
    if (Heading.length > 60) {
        // 10
        currentScore += 10;
        outputString = giveSuggestion(`Please try to reduce the length of your heading as search engines will truncate headings that are longer than 60 characters%`,outputString);// yellow
    }
    // checking for count of keywords in the array 
    const headingArray = Heading.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
    let anyKeywordHeading : boolean= false;
    keyArray.forEach((element) => {
        if (headingArray.includes(element)) anyKeywordHeading = true;
    });
    if (!anyKeywordHeading) {
        // 15
        currentScore += 15;
        outputString = giveSuggestion(`Please try to add some keywords in the heading because they help search engines understand the content of your page.%`,outputString);// yellow
    }
    score -= currentScore;
    return {string : outputString , scr : score}
}
function checkForHeirarchy(headerTags : Element[],outputString : string,score : number) {
    // console.log('anshul');
    let countHeader = [1, 0, 0, 0, 0, 0, 0];
    let currentScore = 0;
    for (let i = 0; i < headerTags.length; i++) {

        const currTag = headerTags[i];
        const level = parseInt(currTag.tagName.charAt(1));
        countHeader[level]++;
        if (level == 1) continue;
        let anyError = false;
        let allLevelCheck = '';
        for (let j = 1; j < level; j++) {
            if (countHeader[j] == 0) {
                // console.log('anshul');z
                allLevelCheck = `${allLevelCheck}There should be atleast one h${j} tag above this tag%`;
                anyError = true;
            }
        }
        if (anyError) {
            const headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g,' ').trim();
            // console.log(headerText);
            outputString = giveSuggestion(`Heirarchy incosistency found for the header ${headerText}%`,outputString);// transparent
            // console.log(allLevelCheck);
            // 5
            currentScore += 5;
            outputString = giveSuggestion(allLevelCheck,outputString);// yellow
            // outputString = giveSuggestion(`<li> No heirarchy problems with this heading </li>`,outputString);
        }
    }
    // max(25)
    score -= Math.min(25,currentScore);
    return {string : outputString,scr : score};
}
function giveSuggestion(text : string,outputHtmlString : string) {
    outputHtmlString = `${outputHtmlString}${text}`;
    return outputHtmlString;
}
function hasOnlyWhitespaceContent(element : Element) {
    if(element == null)return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent?.trim() ?? "";// check by using length on trim
    return whitespaceRegex.test(content);
}
// export { checkBodyTextContent };
// How to tell user that there is a tag with no content , kindly remove it / or no need to do it.