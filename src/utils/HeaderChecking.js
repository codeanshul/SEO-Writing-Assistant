// let str ;
import getInnerText from "./GetInnerText";
export default function checkHeaders(htmlInput, keyArray) {

    let objReturn = {
        title: 'Header Checking',
        content: "No content given",
        score : 20,
    }
    if (htmlInput === '' || keyArray === null) return objReturn;
    let outputString = '';
    let headerTags = htmlInput.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let tempObj = filtertags(headerTags,outputString);
    headerTags = tempObj.headerTags// will remove all the header tags which do not have any content in it
    outputString = tempObj.outputString;
    if (headerTags.length === 0) {
        outputString = giveSuggestion(`No header tags.`,outputString);// red
        objReturn.content = outputString;
        return objReturn;
    }
    // check for the first header tag in the content , if it is h1 then , else report
    if (headerTags[0].tagName != "H1") {
        outputString = giveSuggestion(`Your content's first heading should be h1 tag only , You have ${headerTags[0].tagName}.`,outputString);// red
    }
    // check for number of h1 heading in the content , if it is more than 1 report
    outputString = countH1Tags(headerTags,outputString);
    // take the first heading and check for the keywords assuming that first heading is h1 , if it is not we have already reported above
    outputString = checkForKeywordsHeading(headerTags[0], keyArray,outputString);
    // check for proper heirarchy , can be done in a section/div/ or a wrapping element - will do
    outputString = checkForHeirarchy(headerTags,outputString);
    // console.log(outputString);
    objReturn.content = outputString;
    return objReturn;
}
function filtertags(headerTags,outputString) {

    let tempObj = {
        headerTags : [],
        outputString : '',
    };
    let contenttags = [];
    for (let i = 0; i < headerTags.length; i++) {
        let tag = headerTags[i].tagName;
        
        let headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
        // console.log(headerText);
        // getting a error in a page source.
        if(headerText.length == 0 || headerText.length == 1)outputString = giveSuggestion(`You have a ${tag}tag which has no content in it .`,outputString);
        else {
            contenttags.push(headerTags[i]);
        }
    }
    tempObj.headerTags = contenttags;
    tempObj.outputString = outputString;
    return tempObj;
}
function countH1Tags(headerTags,outputString) {
    let cnth1 = 0;
    for (let tag of headerTags) {
        if (parseInt(tag.tagName.charAt(1)) == 1) {
            cnth1++;
        }
    }
    if (cnth1 > 1) {
        outputString = giveSuggestion(`There should be only 1 h1 tag in the page,You have ${cnth1}.`,outputString);// yellow
    }
    return outputString;
}
function checkForKeywordsHeading(firstHeaderTag, keyArray,outputString) {
    let Heading = firstHeaderTag.childNodes[0].textContent.trim();
    if (Heading.length > 60) {
        outputString = giveSuggestion(`Please try to reduce the length of your heading.`,outputString);// yellow
    }
    else if (Heading.length < 5) {
        outputString = giveSuggestion(`Please try to enlarge the length of your heading.`,outputString);// yellow
    }
    // checking for count of keywords in the array 
    let headingArray = Heading.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
    let anyKeywordHeading = false;
    keyArray.forEach((element) => {
        if (headingArray.includes(element)) anyKeywordHeading = true;
    });
    if (!anyKeywordHeading) {
        outputString = giveSuggestion(`No keywords in the heading , Please try to add some.`,outputString);// yellow
    }
    // console.log(outputString);
    return outputString;
}
function checkForHeirarchy(headerTags,outputString) {
    // console.log('anshul');
    let countHeader = [1, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < headerTags.length; i++) {

        let currTag = headerTags[i];
        let level = parseInt(currTag.tagName.charAt(1));
        countHeader[level]++;
        if (level == 1) continue;
        let anyError = false;
        let allLevelCheck = '';
        for (let j = 1; j < level; j++) {
            if (countHeader[j] == 0) {
                // console.log('anshul');
                allLevelCheck = `${allLevelCheck}There should be atleast one h${j} tag above this tag.`;
                anyError = true;
            }
        }
        if (anyError) {
            let headerText = getInnerText(headerTags[i].innerHTML).replace(/\s+/g, ' ').trim();
            outputString = giveSuggestion(`${headerText}.`,outputString);// transparent
            // console.log(allLevelCheck);
            outputString = giveSuggestion(allLevelCheck,outputString);// yellow
            // outputString = giveSuggestion(`<li> No heirarchy problems with this heading </li>`,outputString);
        }
    }
    return outputString;
}
function giveSuggestion(text,outputHtmlString) {

    outputHtmlString = `${outputHtmlString}${text}`;
    return outputHtmlString;
}
function hasOnlyWhitespaceContent(element) {
    if(element == null)return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
// export { checkBodyTextContent };
// How to tell user that there is a tag with no content , kindly remove it / or no need to do it.