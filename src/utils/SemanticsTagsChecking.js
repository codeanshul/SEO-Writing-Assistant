// check for all the empty tags , which have no use , can remove these types of tags.
import getInnerText from "./GetInnerText"
export default function checkSemanticTags(htmlInput) {

    let objReturn = {
        title: 'Semantic Tags Checking',
        content: 'No Content Given'
    }
    // console.log(htmlInput.text());
    if (htmlInput === '') return objReturn;
    let outputString = '';
    let isEmpty = [];
    outputString = checkEmptyTags(htmlInput, outputString, isEmpty);
    outputString = checkMaintag(htmlInput, outputString, isEmpty);
    outputString = checkArticleTag(htmlInput, outputString, isEmpty);
    outputString = checkSectionTag(htmlInput, outputString, isEmpty);
    outputString = checkDivNesting(htmlInput, outputString);
    outputString = countPercentageNonSemantictags(htmlInput, outputString);
    objReturn.content = outputString;
    return objReturn;
}
function checkEmptyTags(htmlInput, outputString, isEmpty) {
    let allTags = htmlInput.querySelectorAll('body *');
    let emptyTags = new Map();
    // console.log(allTags);
    allTags = seperateScript(allTags);
    function seperateScript(allTags) {
        let tagArr = [];
        for (let tag of allTags) {
            if (tag.nodeName != "SCRIPT" && tag.nodeName != "STYLE") tagArr.push(tag);
        }
        return tagArr;
    }
    allTags.forEach(tag => {

        if (tag.childNodes.length === 0) {
            if (!emptyTags.has(tag.nodeName)) {
                emptyTags.set(tag.nodeName, 1);
            }
            else {
                let cnt = emptyTags.get(tag.nodeName);
                emptyTags.set(tag.nodeName, cnt + 1);
            }
            isEmpty.push(tag);
        }
        else if (tag.childNodes.length == 1 && hasOnlyWhitespaceContentOrNULL(tag.childNodes[0])) {
            if (!emptyTags.has(tag.nodeName)) {
                emptyTags.set(tag.nodeName, 1);
            }
            else {
                let cnt = emptyTags.get(tag.nodeName);
                emptyTags.set(tag.nodeName, cnt + 1);
            }
            isEmpty.push(tag);
        }
    });
    if (emptyTags.size === 0) return outputString;
    outputString = giveSuggestion(`<h4> Check for empty tags </h4>`, outputString);
    for (let [key, value] of emptyTags) {
        outputString = giveSuggestion(`<li> There are ${value} empty tags of ${key} </li>`, outputString);
    }
    return outputString;
}
//1) check for main tag , main's parent should be body tag 
// main tag should not contain <header> , <nav> , <footer> tags inside it -> Done
function checkMaintag(htmlInput, outputString, isEmpty) {
    outputString = giveSuggestion(`<h4>Check for main tag </h4>`, outputString);
    const mainTag = htmlInput.getElementsByTagName('main');
    if (mainTag.length == 0) {
        outputString = giveSuggestion(`<li> Add atleast one mainTag in your content </li>`, outputString);
        return;
    }
    else if (mainTag.length > 1) {
        outputString = giveSuggestion(` <li> There should exist only one main tag in a content </li>`, outputString);
    }
    for (let tag of mainTag)// If there exists more main tags
    {
        if (isEmpty.includes(tag)) continue;
        if (tag.parentNode.nodeName != 'BODY') {
            outputString = giveSuggestion(` <li> Parent Node of main tag should be only body tag </li> `, outputString);
        }
        let allChild = tag.children;
        for (let child of allChild) {
            let childTagname = child.nodeName;
            if (childTagname == "HEADER") outputString = giveSuggestion(` <li> Header tag should not be inside main tag </li> `, outputString);
            else if (childTagname == "FOOTER") outputString = giveSuggestion(` <li> Footer tag should not be inside main tag </li>`, outputString);
            else if (childTagname == "NAV") outputString = giveSuggestion(` <li> Nav tag should not be inside main tag </li> `, outputString);
        }
    }
    return outputString;
}
//2)article tag should contain some heading in it
// It should just not contain only text tags like <p> <span> etc , but should contain <img> <video> <audio>tags as well
// article should be directly nested within <body> <main> <section>
// article should not be nested within itself
function checkArticleTag(htmlInput, outputString, isEmpty) {

    const allArticletags = htmlInput.getElementsByTagName('article');
    if (allArticletags.length === 0) return outputString;
    // outputString = giveSuggestion(`<h4> Check for article tag </h4> `, outputString);
    // first deal all things with children
    for (let articleTag of allArticletags) {
        
        if (isEmpty.includes(articleTag)) continue;
        let articleText = getInnerText(articleTag.innerText);
        if(articleText.length < 10)outputString = giveSuggestion(`<h4> Check for the Article tag ${articleText} </h4>`,outputString);
        else outputString = giveSuggestion(`<h4> Check for the Article tag ${getTruncateText(articleText,25)} </h4>`,outputString);
        let allChild = articleTag.children;
        let notAllTextTag = false;
        let headingPresent = false;
        for (let tag of allChild) {
            if (tag.nodeName.startsWith('H')) headingPresent = true;
            if (tag.nodeName != 'P' && tag.nodeName != 'SPAN') {
                notAllTextTag = true;
            }
        }
        if (!headingPresent) {
            outputString = giveSuggestion(`<li> No heading present in this article tag </li> `, outputString);
        }
        if (!notAllTextTag) {
            outputString = giveSuggestion(` <li> Only text type tags present , can use section instead </li> `, outputString);
        }
        // make in same loop of children
        let RecPartag = articleTag;
        let isParArticlePresent = false;
        while (RecPartag.nodeName != "BODY") {
            RecPartag = RecPartag.parentNode;
            if (RecPartag.nodeName == "ARTICLE") isParArticlePresent = true;
        }
        if (isParArticlePresent) {
            outputString = giveSuggestion(`<li>Article tag can not be nested inside another article tag</li>`, outputString);
        }
        let currPartag = articleTag.parentNode.nodeName;
        if (currPartag != "BODY" && currPartag != "MAIN" && currPartag != "SECTION") {
            outputString = giveSuggestion(` <li> Article's parent tag should be only Body , Main or Section </li>`, outputString);
        }
    }
    return outputString;
}
//3) section should contain some heading in it
function checkSectionTag(htmlInput, outputString, isEmpty) {
    // outputString = giveSuggestion(`<h4> Check for section tag </h4> `, outputString);
    const allSectionTags = htmlInput.getElementsByTagName('section');
    if (allSectionTags.length == 0) return;
    for (let sectionTag of allSectionTags) {
        if (isEmpty.includes(sectionTag)) continue;
        let sectionText = getInnerText(sectionTag.innerText);
        if(sectionText.length < 10)outputString = giveSuggestion(`<h4> Check for the Section tag ${sectionText} </h4>`,outputString);
        else outputString = giveSuggestion(`<h4> Check for the Section tag ${getTruncateText(sectionText,25)} </h4>`,outputString)
        let childTags = sectionTag.children;
        let headingPresent = false;
        for (let tag of childTags) {
            if (tag.nodeName.startsWith('H')) {
                headingPresent = true;
                break;
            }
        }
        if (!headingPresent) {
            outputString = giveSuggestion(`<li> Heading tag is not present in this section </li>`, outputString);
            // console.log("Heading tag is not present in this section");
        }
    }
    return outputString;
}
//4)check for div's tag's deep nesting and report if exceeds limit
// Lets assume it for 3 levels 

function checkDivNesting(htmlInput, outputString) {

    const allDivs = htmlInput.querySelectorAll("div");
    outputString = giveSuggestion(` <h4> Check for nesting of div tags </h4>`, outputString);
    let isSeenDiv = new Map();
    function nestingLevelDfs(tag) {
        isSeenDiv.set(tag, 1);
        let level = 1;
        for (let childDiv of tag.children) {
            if (childDiv && childDiv.tagName === "DIV" && !isSeenDiv.has(childDiv)) {
                isSeenDiv[childDiv] = 1;
                level = Math.max(level, 1 + nestingLevelDfs(childDiv));
            }
        }
        return level;
    }
    for (let divTag of allDivs) {
        // Get the number of nested divs for the current div
        // we wont check for isempty tag for this , as we want to remove max nesting from the html
        if (!isSeenDiv.has(divTag)) {
            let maxLevel = nestingLevelDfs(divTag);
            if (maxLevel > 2) {
                outputString = giveSuggestion(" <li> Error: More than 2 nested divs found </li> ", outputString);
            }
        }
    }
    return outputString;
}
function countPercentageNonSemantictags(htmlInput, outputString) {
    const allNonSemanticTags = ['div', 'span', 'br', 'em', 'strong', 'i', 'u', 'ol', 'ul'];
    const allTags = htmlInput.querySelectorAll('body *');
    const countAlltags = allTags.length;
    let countNonSemantic = 0;
    for (let tag of allTags) {
        if (allNonSemanticTags.includes(tag.nodeName.toLowerCase())) {
            countNonSemantic++;
        }
    }
    let percentage = (countNonSemantic / countAlltags) * 100;
    if (percentage > 30) outputString = giveSuggestion(`<h5>Percentage of non semantic tags in the content is ${percentage},a good practice is to maintain maximum 30% tags</h5>`, outputString);
    return outputString;
    // Limit for percentage of non semantic
}
function hasOnlyWhitespaceContentOrNULL(element) {
    if (element == null) return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
function giveSuggestion(text, outputString) {

    outputString = `${outputString}${text}`;
    return outputString;
}
function getTruncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }

    const truncatedText = text.slice(0, maxLength - 3) + '...';
    console.log(truncatedText);
    return truncatedText;
}
