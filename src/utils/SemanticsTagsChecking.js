// check for all the empty tags , which have no use , can remove these types of tags.
import getInnerText from "./GetInnerText.js"
export default function checkSemanticTags(htmlInput) {

    let objReturn = {
        title: 'Recommendations for Semantic Tags',
        content: 'No Content Given',
        score: 20,
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
function checkEmptyTags(htmlInput, outputString, isEmpty){
    // check this function
    outputString = giveSuggestion(`Check for Empty tags%`, outputString);// transparent h4
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
        let tagName = tag.nodeName;
        // let tagText = getInnerText(tag.innerHTML).replace(/\s+/g, ' ').trim();
        if (tagName === 'IMG') {
            if (!tag.getAttribute('src')) {
                if (!emptyTags.has(tagName)) {
                    emptyTags.set(tagName, 1);
                }
                else {
                    let cnt = emptyTags.get(tagName);
                    emptyTags.set(tagName, cnt + 1);
                }
                isEmpty.push(tag);
            }
        }
        else if(tagName === 'A')
        {
            if(!tag.getAttribute('href')){
                if (!emptyTags.has(tagName)) {
                    emptyTags.set(tagName, 1);
                } 
                else {
                    let cnt = emptyTags.get(tagName);
                    emptyTags.set(tagName, cnt + 1);
                }
                isEmpty.push(tag);
            }
        }
        else if(tag.childNodes.length === 0){
            if (!emptyTags.has(tagName)) {
                emptyTags.set(tagName, 1);
            } 
            else {
                let cnt = emptyTags.get(tagName);
                emptyTags.set(tagName, cnt + 1);
            }
            isEmpty.push(tag);
        }
    });
    if (emptyTags.size === 0)outputString = giveSuggestion('No empty tags in the page%',outputString);
    for (let [key, value] of emptyTags) {
        outputString = giveSuggestion(`There are ${value} empty tags of ${key}%`, outputString);// yellow li
    }
    return outputString;
}
//1) check for main tag , main's parent should be body tag 
// main tag should not contain <header> , <nav> , <footer> tags inside it -> Done
function checkMaintag(htmlInput, outputString, isEmpty) {
    outputString = giveSuggestion(`Check for main tag%`, outputString);// transparent h4
    const mainTag = htmlInput.getElementsByTagName('main');
    if (mainTag.length == 0) {
        outputString = giveSuggestion(`Add atleast one mainTag in your content%`, outputString);// red li 
        return;
    }
    else if (mainTag.length > 1) {
        outputString = giveSuggestion(`There should exist only one main tag in a content%`, outputString);// red li
    }
    for (let tag of mainTag)// If there exists more main tags
    {
        if (isEmpty.includes(tag)) continue;
        if (tag.parentNode.nodeName != 'BODY') {
            outputString = giveSuggestion(`Parent Node of main tag should be only body tag%`, outputString);// yellow li
        }
        let allChild = tag.children;
        for (let child of allChild) {
            let childTagname = child.nodeName;
            if (childTagname == "HEADER") outputString = giveSuggestion(`Header tag should not be inside main tag%`, outputString);// yellow li
            else if (childTagname == "FOOTER") outputString = giveSuggestion(`Footer tag should not be inside main tag%`, outputString);// yellow li
            else if (childTagname == "NAV") outputString = giveSuggestion(`Nav tag should not be inside main tag%`, outputString);// yellow li
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
        let articleText = getInnerText(articleTag.innerHTML).replace(/\s+/g, ' ').trim();
        outputString = giveSuggestion(`Check for the Article tag ${getTruncateText(articleText, 25)}%`, outputString);// transparent h4
        let allChild = articleTag.children;
        let notAllTextTag = false;
        let headingPresent = false;
        for (let tag of allChild) {
            if (tag.nodeName.startsWith('H')) headingPresent = true;
            if (tag.nodeName != 'P' && tag.nodeName != 'SPAN') {
                notAllTextTag = true;
            }
        }
        let anyError = false;
        if (!headingPresent) {
            outputString = giveSuggestion(`No heading present in this article tag%`, outputString);// red li
            anyError = true;
        }
        if (!notAllTextTag) {
            outputString = giveSuggestion(`Only text type tags present , can use section instead%`, outputString);// yellow li
            anyError = true;
        }
        // make in same loop of children
        let RecPartag = articleTag;
        let isParArticlePresent = false;
        while (RecPartag.nodeName != "BODY") {
            RecPartag = RecPartag.parentNode;
            if (RecPartag.nodeName == "ARTICLE") isParArticlePresent = true;
        }
        if (isParArticlePresent) {
            anyError = true;
            outputString = giveSuggestion(`Article tag can not be nested inside another article tag%`, outputString);// yellow li
        }
        let currPartag = articleTag.parentNode.nodeName;
        if (currPartag != "BODY" && currPartag != "MAIN" && currPartag != "SECTION") {
            anyError = true;
            outputString = giveSuggestion(`Article's parent tag should be only Body , Main or Section%`, outputString);// yellow li
        }
        if (!anyError) outputString = giveSuggestion('No error in this article tag%', outputString);// green li
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
        let sectionText = getInnerText(sectionTag.innerHTML).replace(/\s+/g,' ').trim();
        let truncatedText = getTruncateText(sectionText,25);
        outputString = giveSuggestion(`Check for the Section tag ${truncatedText}%`, outputString);
        if(!truncatedText || truncatedText === ' ')outputString = giveSuggestion(`This section is used as a wrapper%`,outputString)// yellow li
        let anyError = false;
        let childTags = sectionTag.children;
        let headingPresent = false;
        for (let tag of childTags) {
            if (tag.nodeName.startsWith('H')) {
                headingPresent = true;
                break;
            }
        }
        if (!headingPresent) {
            anyError = true;
            outputString = giveSuggestion(`Heading tag is not present in this section%`, outputString);// yellow li
            // console.log("Heading tag is not present in this section");
        }
        if (!anyError) outputString = giveSuggestion('No error in this section tag%', outputString);// green li
    }
    return outputString;
}
//4)check for div's tag's deep nesting and report if exceeds limit
// Lets assume it for 3 levels 

function checkDivNesting(htmlInput, outputString) {

    const allDivs = htmlInput.querySelectorAll("div");
    outputString = giveSuggestion(`Check for nesting of div tags%`, outputString);// transparent h4
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
                const divText = getTruncateText(getInnerText(divTag.innerHTML).replace(/\s+/g, ' ').trim(), 25);
                outputString = giveSuggestion(`More than 2 nested divs found for the parent div ${divText},can split in exclusive sections%`, outputString);// yellow li
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
    if (percentage > 50) outputString = giveSuggestion(`Percentage of non semantic tags in the content is ${percentage.toFixed(2)},a good practice is to maintain maximum 50 percentage of nonsemantic tags`, outputString);
    else if(percentage <= 20)outputString = giveSuggestion(`Its good that you have less percentage of non semantic tags in the content ${percentage.toFixed(2)}`,outputString);
    // h6 yellow
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
    return truncatedText;
}
