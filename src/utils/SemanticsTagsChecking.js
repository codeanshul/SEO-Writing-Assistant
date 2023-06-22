// check for all the empty tags , which have no use , can remove these types of tags.
var isEmpty = [];
export default function allSemanticCheckFunctions(htmlInput) {
    
    checkEmptyTags(htmlInput);
    checkMaintag(htmlInput);
    checkArticleTag(htmlInput);
    checkSectionTag(htmlInput);
    checkDivNesting(htmlInput);
    countPercentageNonSemantictags(htmlInput);
}
function checkEmptyTags(htmlInput) {
    let allTags = htmlInput.querySelectorAll('body *');
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
        // console.log(tag.nodeName);
        if (tag.childNodes[0] == null) {
            isEmpty.push(tag);
            giveSuggestion(`<p> Please remove Empty Tag ${tag.nodeName} </p> `);
        }
        else if (tag.childNodes.length == 1 && hasOnlyWhitespaceContentOrNULL(tag.childNodes[0])) {
            isEmpty.push(tag);
            giveSuggestion(`<p> Please remove Empty Tag ${tag.nodeName} </p> `);
        }
    });
}
//1) check for main tag , main's parent should be body tag 
// main tag should not contain <header> , <nav> , <footer> tags inside it -> Done
function checkMaintag(htmlInput) {
    giveSuggestion(`<h4>Check for main tag </h4>`);
    const mainTag = htmlInput.getElementsByTagName('main');
    if (mainTag.length == 0) {
        giveSuggestion(`<p> Add atleast one mainTag in your content </p>`);
        return;
    }
    else if (mainTag.length > 1) {
        giveSuggestion(` <p> There should exist only one main tag in a content </p>`);
    }
    for (let tag of mainTag)// If there exists more main tags
    {
        if (tag.parentNode.nodeName != 'BODY') {
            giveSuggestion(` <p> Parent Node of main tag should be only body tag </p> `);
        }
        let allChild = tag.children;
        for (let child of allChild) {
            let childTagname = child.nodeName;
            if (childTagname == "HEADER") giveSuggestion(` <p> Header tag should not be inside main tag </p> `);
            else if (childTagname == "FOOTER") giveSuggestion(` <p> Footer tag should not be inside main tag </p>`);
            else if (childTagname == "NAV") giveSuggestion(` <p> Nav tag should not be inside main tag </p> `);
        }
    }
}
//2)article tag should contain some heading in it
// It should just not contain only text tags like <p> <span> etc , but should contain <img> <video> <audio>tags as well
// article should be directly nested within <body> <main> <section>
// article should not be nested within itself
function checkArticleTag(htmlInput) {
    giveSuggestion(`<h4> Check for article tag </h4> `);
    const allArticletags = htmlInput.getElementsByTagName('article');
    if (allArticletags.length == 0) return;
    // first deal all things with children
    for (let articleTag of allArticletags) {
        if (isEmpty.includes(articleTag)) continue;
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
            giveSuggestion(`<p> No heading present in this article tag </p> `);
        }
        if (!notAllTextTag) {
            giveSuggestion(` <p> Only text type tags present , can use section instead </p> `);
        }
        // make in same loop of children
        let RecPartag = articleTag;
        let isParArticlePresent = false;
        while (RecPartag.nodeName != "BODY") {
            RecPartag = RecPartag.parentNode;
            if (RecPartag.nodeName == "ARTICLE") isParArticlePresent = true;
        }
        if (isParArticlePresent) {
            giveSuggestion(`Article tag can not be nested inside another article tag`);
        }
        let currPartag = articleTag.parentNode.nodeName;
        if (currPartag != "BODY" && currPartag != "MAIN" && currPartag != "SECTION") {
            giveSuggestion(` <p> Article's parent tag should be only Body , Main or Section </p>`);
        }
    }
}

//3) section should contain some heading in it

function checkSectionTag(htmlInput) {
    giveSuggestion(`<h4> Check for section tag </h4> `);
    const allSectionTags = htmlInput.getElementsByTagName('section');
    if (allSectionTags.length == 0) return;
    for (let sectionTag of allSectionTags) {
        if (isEmpty.includes(sectionTag)) continue;
        let childTags = sectionTag.children;
        let headingPresent = false;
        for (let tag of childTags) {
            if (tag.nodeName.startsWith('H')) {
                headingPresent = true;
                break;
            }
        }
        if (!headingPresent) {
            // console.log("Heading tag is not present in this section");
        }
    }
}

//4)check for div's tag's deep nesting and report if exceeds limit
// Lets assume it for 3 levels 

function checkDivNesting(htmlInput) {

    const allDivs = htmlInput.querySelectorAll("div");
    giveSuggestion(" <h4> Check for nesting of div tags </h4>");
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
        if (!isSeenDiv.has(divTag)) {
            let maxLevel = nestingLevelDfs(divTag);
            // console.log(maxLevel);
            if (maxLevel > 2) giveSuggestion(" <p> Error: More than 2 nested divs found </p> ");
        }
    }
}

function countPercentageNonSemantictags(htmlInput) {
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
    giveSuggestion(`<h4>Percentage of non semantic tags in the content is ${percentage} </h4>`);
    // Limit for percentage of non semantic
}

function giveSuggestion(textContent) {
    let semanticOutput = document.getElementById(`Semantics`);
    // console.log(semanticOutput);
    semanticOutput.insertAdjacentHTML('beforeend', textContent);
}

function hasOnlyWhitespaceContentOrNULL(element) {
    if (element == null) return true;
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
