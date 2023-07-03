// check for all the empty tags , which have no use , can remove these types of tags.
import getInnerText from "./getInnerText.tsx"
export default function checkSemanticTags(htmlInput : HTMLElement) {
    let objReturn = {
        title: 'Semantic Tags',
        content: 'No Content Given',
        score: 0,
    }
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    let outputString = '';
    let isEmpty : Element[] = [];
    outputString = checkMaintag(htmlInput, outputString, isEmpty);
    const objEmptyTags = checkEmptyTags(htmlInput, outputString, isEmpty);// 20
    const objArticleTags = checkArticleTag(htmlInput, objEmptyTags.string, isEmpty);// 25
    const objSectionTags = checkSectionTag(htmlInput, objArticleTags.string, isEmpty);// 15
    const objDivNesting = checkDivNesting(htmlInput, objSectionTags.string);// 20
    const objPercentageNonSemantic = countPercentageNonSemantictags(htmlInput, objDivNesting.string);// 20
    objReturn.content = objPercentageNonSemantic.string;
    objReturn.score = (objEmptyTags.scr + objArticleTags.scr + objSectionTags.scr + objDivNesting.scr + objPercentageNonSemantic.scr) * 0.25;
    return objReturn;
}
function checkEmptyTags(htmlInput : HTMLElement, outputString : string,isEmpty : Element[]) {
    // check this function
    outputString = giveSuggestion(`Check for Empty tags%`, outputString);// transparent h4
    let allTags : Element[] = Array.from(htmlInput.getElementsByTagName('*'));
    // console.log(allTags);
    const textContainTags = ['DIV', 'P', 'SPAN', 'H', 'STRONG', 'B', 'I', 'EM','ARTICLE','SECTION'];
    let emptyTags = new Map();
    allTags = seperateScript(allTags);
    function seperateScript(allTags : Element[]) {
        let tagArr = [];
        for (let tag of allTags) {
            if (tag.nodeName != "SCRIPT" && tag.nodeName != "STYLE") tagArr.push(tag);
        }
        return tagArr;
    }
    let score = 100;
    allTags.forEach(tag => {
        const tagName = tag.nodeName;
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
        else if (tagName === 'A') {
            if (!tag.getAttribute('href')) {
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
        else if (tag.childNodes.length === 0 && textContainTags.includes(tagName)) {
            // console.log(tagName);
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
    // console.log(isEmpty);
    if (emptyTags.size === 0) {
        outputString = giveSuggestion('No empty tags in the page%', outputString);
        return { empty: isEmpty, scr: score * 0.2, string: outputString };
    }
    let totEmptyTags = 0;
    for (let [key, value] of emptyTags) {
        outputString = giveSuggestion(`There are ${value} empty tags of ${key.toLowerCase()}%`, outputString);// yellow li
    }
    if (totEmptyTags < 10) score -= 30;
    else if (totEmptyTags < 20) score -= 50;
    else if (totEmptyTags < 30) score -= 70;
    else score -= 90;
    return { empty: emptyTags, string: outputString, scr: score * 0.2 };
}
//1) check for main tag , main's parent should be body tag 
// main tag should not contain <header> , <nav> , <footer> tags inside it -> Done
function checkMaintag(htmlInput : HTMLElement, outputString : string, isEmpty : Element[]) {
    outputString = giveSuggestion(`Main tag Check%`, outputString);// transparent h4
    const mainTag = htmlInput.getElementsByTagName('main');
    if (mainTag.length == 0) {
        outputString = giveSuggestion(`Add atleast one mainTag in your content%`, outputString);// red li 
        return outputString;
    }
    else if (mainTag.length > 1) {
        outputString = giveSuggestion(`There should exist only one main tag in a content%`, outputString);// red li
    }
    for (let tag of mainTag)// If there exists more main tags
    {
        if (isEmpty.includes(tag)) continue;
        let prNode = tag.parentNode?.nodeName 
        if (prNode != 'BODY') {
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
function checkArticleTag(htmlInput : HTMLElement, outputString : string, isEmpty : Element[]) {

    const allArticletags = htmlInput.getElementsByTagName('article');
    if (allArticletags.length === 0) return { string: outputString, scr: 20 };
    let score = allArticletags.length * 100;
    for (let articleTag of allArticletags) {
        if (isEmpty.includes(articleTag)) continue;
        const articleText = getInnerText(articleTag.innerHTML).replace(/\s+/g, ' ').trim();
        if(!articleText|| articleText == ' ')outputString = giveSuggestion(`Article check for ... (No text inside this tag)%`,outputString);
        else outputString = giveSuggestion(`Article check for ${getTruncateText(articleText, 25)}%`, outputString);// transparent h4
        const allChild = articleTag.children;
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
            // 30
            score -= 30;
            outputString = giveSuggestion(`No heading present in this article tag%`, outputString);// red li
            anyError = true;
        }
        if (!notAllTextTag) {
            // 20
            score -= 20;
            outputString = giveSuggestion(`Article Tags should not be only used to wrap only individual paragraphs or sentences.%`, outputString);// yellow li
            anyError = true;
        }
        // make in same loop of children
        let RecPartag : Element = articleTag;
        let isParArticlePresent = false;
        while (RecPartag.nodeName != "BODY") {
            RecPartag = (RecPartag?.parentNode as Element) ||  null;
            if (RecPartag.nodeName == "ARTICLE") isParArticlePresent = true;
        }
        if (isParArticlePresent) {
            // 20
            score -= 20;
            anyError = true;
            outputString = giveSuggestion(`Article tag should not be nested inside another article tag , as they individually is a standalone piece of content. %`, outputString);// yellow li
        }
        const currPartag = articleTag.parentNode?.nodeName;
        if (currPartag != "BODY" && currPartag != "MAIN" && currPartag != "SECTION") {
            // 
            score -= 20;
            anyError = true;
            outputString = giveSuggestion(`Article's parent tag should be only Body , Main or Section%`, outputString);// yellow li
        }
        if (!anyError) outputString = giveSuggestion('No error in this article tag%', outputString);// green li
    }
    score = score / allArticletags.length;
    return { string: outputString, scr: (score) * 0.25 };
}
//3) section should contain some heading in it
function checkSectionTag(htmlInput : HTMLElement, outputString : string, isEmpty : Element[]) {
    // outputString = giveSuggestion(`<h4> Check for section tag </h4> `, outputString);
    const allSectionTags = htmlInput.getElementsByTagName('section');
    if (allSectionTags.length == 0) return { string: outputString, scr: 15 };
    let score = allSectionTags.length * 100;
    for (let sectionTag of allSectionTags) {
        if (isEmpty.includes(sectionTag)) continue;
        const sectionText = getInnerText(sectionTag.innerHTML).replace(/\s+/g, ' ').trim();
        const truncatedText = getTruncateText(sectionText, 25);
        if(truncatedText == '...')outputString = giveSuggestion(`Section check for ... (No text inside this tag)`,outputString)
        outputString = giveSuggestion(`Section check for  ${truncatedText}%`, outputString);
        if (!truncatedText || truncatedText === ' ') {
            score -= 50;
            outputString = giveSuggestion(`This section is used as a wrapper , can use a div instead%`, outputString);

        }// yellow li
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
            score -= 50;
            anyError = true;
            outputString = giveSuggestion(`Heading tag is not present in this section%`, outputString);// yellow li
            // console.log("Heading tag is not present in this section");
        }
        if (!anyError) outputString = giveSuggestion('No error in this section tag%', outputString);// green li
    }
    return { string: outputString, scr: score * 0.15 };
}
//4)check for div's tag's deep nesting and report if exceeds limit
// Lets assume it for 3 levels 

function checkDivNesting(htmlInput : HTMLElement, outputString : string) {

    const allDivs = htmlInput.querySelectorAll("div");
    if (allDivs.length === 0) return { string: outputString, scr: 20 };
    outputString = giveSuggestion(`Maximal nesting div tags check%`, outputString);// transparent h4
    let isSeenDiv  = new Map<Element,number>();
    function nestingLevelDfs(tag : Element) {
        isSeenDiv.set(tag, 1);
        let level = 1;
        for (let childDiv of tag.children) {
            if (childDiv && childDiv.tagName === "DIV" && !isSeenDiv.has(childDiv)) {
                isSeenDiv.set(childDiv,1);
                level = Math.max(level, 1 + nestingLevelDfs(childDiv));
            }
        }
        return level;
    }
    let cntNesting = 0;
    for (let divTag of allDivs) {
        // Get the number of nested divs for the current div
        // we wont check for isempty tag for this , as we want to remove max nesting from the html
        if (!isSeenDiv.has(divTag)) {
            let maxLevel = nestingLevelDfs(divTag);
            if (maxLevel > 2) {
                cntNesting++;
                const divText = getTruncateText(getInnerText(divTag.innerHTML).replace(/\s+/g, ' ').trim(), 25);
                outputString = giveSuggestion(`More than 2 nested divs found for the parent div ${divText},can split in exclusive sections%`, outputString);// yellow li
            }
        }
    }
    let score = 100;
    if (cntNesting > 0 && cntNesting < 4) score = 80;
    else if (cntNesting < 7) score = 50;
    else score = 20;
    return { string: outputString, scr: score * 0.20 };
}
function countPercentageNonSemantictags(htmlInput : HTMLElement, outputString : string) {
    const allNonSemanticTags = ['div', 'span', 'br', 'em', 'strong', 'i', 'u', 'ol', 'ul'];
    const allTags = htmlInput.querySelectorAll('body *');
    const countAlltags = allTags.length;
    let countNonSemantic = 0;
    for (let tag of allTags) {
        if (allNonSemanticTags.includes(tag.nodeName.toLowerCase())) {
            countNonSemantic++;
        }
    }
    const percentage = (countNonSemantic / countAlltags) * 100;
    if (percentage > 50) outputString = giveSuggestion(`Percentage of non semantic tags in the content is ${percentage.toFixed(2)},a good practice is to maintain maximum 50 percentage of nonsemantic tags%`, outputString);
    else if (percentage <= 20) outputString = giveSuggestion(`Its good that you have less percentage of non semantic tags in the content ${percentage.toFixed(2)}%`, outputString);
    // h6 yellow
    let score = 100;
    if (percentage >= 80) score = 30;
    else if (percentage >= 60) score = 60;
    else if (percentage >= 50) score = 80;
    else score = 100;
    return { string: outputString, scr: score * 0.2 };
    // Limit for percentage of non semantic
}
function giveSuggestion(text : string, outputString : string) {

    outputString = `${outputString}${text}`;
    return outputString;
}
function getTruncateText(text : string, maxLength : number) {
    if(!text || text == ' ')return "...";
    if (text.length <= maxLength) {
        return text;
    }
    const truncatedText = text.slice(0, maxLength - 3) + '...';
    return truncatedText;
}
