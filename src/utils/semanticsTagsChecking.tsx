// check for all the empty tags , which have no use , can remove these types of tags.
import getInnerText from "./getInnerText.tsx"
import React from "react";
import { ReactNode } from "react";
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
export default function checkSemanticTags(htmlInput : HTMLElement) {
    let objReturn : ObjReturn = {
        title: 'Semantic Tags',
        content: [],
    }
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    let outputArray : outputObject[] = [];
    let isEmpty : Element[] = [];
    outputArray = checkMaintag(htmlInput, outputArray, isEmpty);
    const objEmptyTags = checkEmptyTags(htmlInput, outputArray, isEmpty);// 20 Empty Tag Check
    outputArray = checkArticleTag(htmlInput, objEmptyTags.string, isEmpty);// 25 Article Tag Check
    outputArray = checkSectionTag(htmlInput, outputArray, isEmpty);// 15 Section Tag Check
    outputArray = checkDivNesting(htmlInput, outputArray);// 20 Div nesting
    outputArray = countPercentageNonSemantictags(htmlInput,outputArray);// 20 Percentage Non Semantic Tags
    objReturn.content = outputArray;
    return objReturn;
}
function checkEmptyTags(htmlInput : HTMLElement, outputArray : outputObject[],isEmpty : Element[]) {
    // check this function
    outputArray.push({
        str : <>Check for empty Tags</>,
        warning : 'big-header-warning',
        iconWarning : '',
        type : 'ul',
    });
    let allTags : Element[] = Array.from(htmlInput.getElementsByTagName('*'));
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
        else if ((tag.childNodes.length === 0 || (tag.childNodes.length === 1 && tag.children.length === 0) && tag.innerHTML.trim() === '')&& (textContainTags.includes(tagName))) {
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
    if (emptyTags.size === 0) {
        outputArray.push({
            str : <>No empty tags in the page</>,
            warning : '',
            iconWarning : 'icon-no-warning',
            type : 'li',
        });
        return { empty: isEmpty, string: outputArray };
    }
    for (let [key, value] of emptyTags) {
        outputArray.push({
            str : <>There are {value} empty tags of {key.toLowerCase()}.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
    }
    return { empty: emptyTags, string: outputArray};
    // If text tag like article , section , div , doesnt have any innerHTML and tags like img and anchor does not have any src link or href attribute
}
//1) check for main tag , main's parent should be body tag 
// main tag should not contain <header> , <nav> , <footer> tags inside it -> Done
function checkMaintag(htmlInput : HTMLElement, outputArray : outputObject[], isEmpty : Element[]) {
    
    outputArray.push({
        str : <>Main tag Check</>,
        warning : 'big-header-warning',
        iconWarning : '',
        type : 'ul',
    });
    let error = false;
    const mainTag = htmlInput.getElementsByTagName('main');
    if (mainTag.length == 0) {
        error = true;
        outputArray.push({
            str : <>Add atleast one mainTag in your content.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'li',
        });
        return outputArray;
    }
    else if (mainTag.length > 1) {
        error = true;
        outputArray.push({
            str : <>There should exist only one main tag in a content</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'li',
        });
    }
    for (let tag of mainTag)// If there exists more main tags
    {
        if (isEmpty.includes(tag)) continue;
        let prNode = tag.parentNode?.nodeName 
        if (prNode != 'BODY') {
            error = true;
            outputArray.push({
                str : <>Parent Node of main tag should only be body tag</>,
                warning : 'big-header-warning',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        let allChild = tag.children;
        for (let child of allChild) {
            let childTagname = child.nodeName;
            if (childTagname == "HEADER") {
                error = true;
                outputArray.push({
                    str : <>Header tag should not be inside main tag</>,
                    warning : 'big-header-warning',
                    iconWarning : 'icon-low-warning',
                    type : 'li',
                });
            }// yellow li
            else if (childTagname == "FOOTER"){
                error = true;
                outputArray.push({
                    str : <>Footer tag should not be inside main tag</>,
                    warning : 'big-header-warning',
                    iconWarning : 'icon-low-warning',
                    type : 'li',
                });
            }// yellow li
            else if (childTagname == "NAV"){
                error = true;
                outputArray.push({
                    str : <>Nav tag should not be inside main tag</>,
                    warning : 'big-header-warning',
                    iconWarning : 'icon-low-warning',
                    type : 'li',
                });
            }// yellow li
        }
    }
    if(!error){
        outputArray.push({
            str : <>No errors were detected within the main tag.</>,
            warning : '',
            iconWarning : 'icon-no-warning',
            type : 'li',
        })
    }
    return outputArray;
}
//2)article tag should contain some heading in it 
// It should just not contain only text tags like <p> <span> etc , but should contain <img> <video> <audio>tags as well
// article should be directly nested within <body> <main> <section>
// article should not be nested within itself
function checkArticleTag(htmlInput : HTMLElement, outputArray : outputObject[], isEmpty : Element[]) {

    const allArticletags = htmlInput.getElementsByTagName('article');
    if (allArticletags.length === 0) return outputArray;
    for (let articleTag of allArticletags) {
        if (isEmpty.includes(articleTag)) continue;
        const articleText = getInnerText(articleTag.innerHTML).replace(/\s+/g, ' ').trim();
        let temporaryList : outputObject[] = []
        const allChild = articleTag.children;
        let notAllTextTag = false;
        let headingPresent = false;
        for (let tag of allChild) {
            if (tag.nodeName.startsWith('H')) headingPresent = true;
            if (tag.nodeName != 'P' && tag.nodeName != 'SPAN') {
                notAllTextTag = true;
            }
        }
        if (!headingPresent) {
            temporaryList.push({
                str : <>No heading present in this article tag.</>,
                warning : '',
                iconWarning : 'icon-high-warning',
                type : 'li',
            });
        }
        if (!notAllTextTag) {
            temporaryList.push({
                str : <>Article Tags should not be only used to wrap only individual paragraphs or sentences.</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        // make in same loop of children
        let RecPartag : Element = articleTag;
        let isParArticlePresent = false;
        while (RecPartag.nodeName != "BODY") {
            RecPartag = (RecPartag?.parentElement as Element) ||  null;
            if (RecPartag.nodeName === "ARTICLE") 
            {
                isParArticlePresent = true;
            }
        }
        if (isParArticlePresent) {
            temporaryList.push({
                str : <>Article tag should not be nested inside another article tag , as they individually is a standalone piece of content.</>,
                warning : '',
                iconWarning : 'icon-high-warning',
                type : 'li',
            });
        }
        const currPartag = articleTag.parentNode?.nodeName;
        if (currPartag != "BODY" && currPartag != "MAIN" && currPartag != "SECTION") {
            temporaryList.push({
                str : <>Article's parent tag should be only Body , Main or Section.</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        if(temporaryList.length !== 0){
            if(!articleText|| articleText == ' '){
                outputArray.push({
                    str : <>Article check for ... <i>(No text inside this tag).</i></>,
                    warning : 'big-header-warning',
                    iconWarning : '',
                    type : 'ul',
                });
            }
            else {
                outputArray.push({
                    str : <>Article check for <i>{getTruncateText(articleText, 25)}..</i></>,
                    warning : 'big-header-warning',
                    iconWarning : '',
                    type : 'ul',
                });
            }
            for(let obj of temporaryList){
                outputArray.push(obj);
            }
        }
    }
    return outputArray;
}
//3) section should contain some heading in it
//   should not be just used as a wrapper
function checkSectionTag(htmlInput : HTMLElement, outputArray : outputObject[], isEmpty : Element[]) {
    // outputArray = giveSuggestion(`<h4> Check for section tag </h4> `, outputArray);
    const allSectionTags = htmlInput.getElementsByTagName('section');
    if (allSectionTags.length == 0) return outputArray;
    for (let sectionTag of allSectionTags) {
        if (isEmpty.includes(sectionTag)) continue;
        let temporaryList : outputObject[] = [];
        const sectionText = getInnerText(sectionTag.innerHTML).replace(/\s+/g, ' ').trim();
        const truncatedText = getTruncateText(sectionText, 25);
        if (isWrapper(sectionTag)) {
            temporaryList.push({
                str : <>This section is used as a wrapper , can use a div instead</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        let childTags = sectionTag.children;
        let headingPresent = false;
        for (let tag of childTags) {
            if (tag.nodeName.startsWith('H')) {
                headingPresent = true;
                break;
            }
        }
        if (!headingPresent) {
            temporaryList.push({
                str : <>Heading tag is not present in this section.</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        if(temporaryList.length !== 0){
            if(truncatedText == '...'){
                outputArray.push({
                    str : <>Section check for ... <i>(No text inside this tag)</i>.</>,
                    warning : 'big-header-warning',
                    iconWarning : '',
                    type : 'ul',
                });
            }
            else {
                outputArray.push({
                    str : <>Section check for <i>{truncatedText}</i></>,
                    warning : 'big-header-warning',
                    iconWarning : '',
                    type : 'ul',
                });
            }
            for(let obj of temporaryList){
                outputArray.push(obj);
            }
        }
    }
    return outputArray;
}
//4)check for div's tag's deep nesting and report if exceeds limit
// Lets assume it for 3 levels 

function checkDivNesting(htmlInput : HTMLElement, outputArray : outputObject[]) {

    const allDivs = htmlInput.querySelectorAll("div");
    if (allDivs.length === 0) return outputArray;
    outputArray.push({
        str : <>Maximal nesting div tags check</>,
        warning : 'big-header-warning',
        iconWarning : '',
        type : 'ul',
    });
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
    let anyError = false;
    for (let divTag of allDivs) {
        // Get the number of nested divs for the current div
        // we wont check for isempty tag for this , as we want to remove max nesting from the html
        if (!isSeenDiv.has(divTag)) {
            let maxLevel = nestingLevelDfs(divTag);
            if (maxLevel > 4) {
                cntNesting++;
                const divText = getTruncateText(getInnerText(divTag.innerHTML).replace(/\s+/g, ' ').trim(), 30);
                anyError = true;
                outputArray.push({
                    str : <span>More than 4 nested divs found for the parent div <i>{divText}</i>,can split in exclusive section.</span>,
                    warning : '',
                    iconWarning : 'icon-high-warning',
                    type : 'li',
                });
            }
        }
    }
    if(!anyError){
        outputArray.push({
            str : <>Less than 4 deep nesting for all Div tags.</>,
            warning : '',
            iconWarning : 'icon-no-warning',
            type : 'li',
        });
        return outputArray;
    }

    return outputArray;
}
function countPercentageNonSemantictags(htmlInput : HTMLElement, outputArray : outputObject[]) {
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
    outputArray.push({
        str : <>Percentage of non semantic tags in the content is {percentage.toFixed(0)},if possible please try to reduce it</>,
        warning : 'big-header-warning',
        iconWarning : 'icon-low-warning',
        type : 'p',
    });
    return outputArray;
    // Limit for percentage of non semantic
}

function getTruncateText(text : string, maxLength : number) {
    if(!text || text == ' ')return "...";
    if (text.length <= maxLength) {
        return text;
    }
    const truncatedText = text.slice(0, maxLength - 3) + '...';
    return truncatedText;
}
function isWrapper(sectionTag : Element){

    let wrap = true;
    for(let childTag of sectionTag.children){

        let tagName = childTag.nodeName;
        if(tagName != 'DIV' && tagName != 'SPAN' && tagName != 'P'){
            wrap = false;
        }
    }
    return wrap;
}