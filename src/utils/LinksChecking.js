export default function checkLinks(htmlInput, keyArray) {
    // console.log(keyArray);
    let objReturn = {
        title: `Int/Ext Links`,
        content: "No content given",
        score: 0,
    }
    let outputString = '';
    if (htmlInput === '' || keyArray === null) return objReturn;
    const allLinks = htmlInput.getElementsByTagName('a');
    if (allLinks.length == 0) {
        outputString = giveSuggestion("No Links in the content%", outputString);
        objReturn.content = outputString;
        return objReturn;
    }
    let internalLinks = [];
    let externalLinks = [];
    for (let link of allLinks) {
        const URL_format = new URL(link.href);
        const url = link.getAttribute('href');
        if (URL_format.hostname.endsWith('sprinklr.com') || url.startsWith('/') || url.startsWith('#')) {
            internalLinks.push(link);
        }
        else externalLinks.push(link);
        // console.log(newURL.hostname);
    }
    const externalCheckObj = externalLinksCheck(externalLinks, keyArray, outputString);
    outputString = externalCheckObj.string;
    const externalLinkScore = externalCheckObj.scr;
    const internalCheckObj = internalLinksCheck(internalLinks, keyArray, outputString);
    // console.log(internalCheckObj.string);
    outputString = internalCheckObj.string;
    const internalLinksScore = internalCheckObj.scr;
    objReturn.content = outputString;
    // weightage of internal link is given half of the weightage of external link , and if their is no external link , then also we'll deduct some score out of it.
    const totalScore = ((externalLinkScore + internalLinksScore) / (Math.max(externalLinks.length * 100, 100) + Math.max(internalLinks.length * 50, 50))) * 100 * 0.15;
    objReturn.score = totalScore;
    return objReturn;

    // 5 external 3 internal , 5-> 300/500 , 3-> 100/150 
}
function externalLinksCheck(externalLinks, keyArray, outputString) {

    let score = externalLinks.length * 100;
    if (externalLinks.length == 0) {
        outputString = giveSuggestion(`If possible,please add some relevant external links to your content,page will get more coverage%`, outputString);// yellow h4
        return { string: outputString, scr: score };
    }
    let anyKeyword = false;// check if their exixts atleast one keyword in all the links
    for (let link of externalLinks) {
        outputString = giveSuggestion(`Check for the external link ${link.href}randommm${link.text}%`, outputString);// tranparent h4
        let anyError = false;
        if (link.text.trim() == ""){// If no anchor text
            // 40
            score -= 40;
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
            anyError = true;
        }
        else // check for keywords inside link
        {
            const anchorText = link.text.trim();
            const anchorSplit = anchorText.split(' ');
            for (let word of anchorSplit) {
                // if(!word)continue;
                if (keyArray.includes(word)) anyKeyword = true;
            }
        }
        if (link.rel !== 'nofollow') {
            // 40
            score -= 35;
            anyError = true;
            outputString = giveSuggestion(`Add a rel attribute as nofollow in the link , as search engines shouldn’t follow these links authority to the link target.%`, outputString);// yellow li
        }
        if (!anyError) {
            outputString = giveSuggestion(`All okay with this link%`, outputString);// green li
        }
    }
    if (!anyKeyword) {
        // 30
        score -= 25 * externalLinks.length;
        outputString = giveSuggestion(`Please add some keyword in the text of the internal links as it can help search engine understand the relevance of the page also it can influence CTR , user experience.%`, outputString);// yellow h4
    }
    return { string: outputString, scr: score };
}
function internalLinksCheck(internalLinks, keyArray, outputString) {
    let score = internalLinks.length * 100;
    if (internalLinks.length == 0) {
        outputString = giveSuggestion(`If possible,please add some relevant internal links to your content%`, outputString);
        return { string: outputString, scr: score };
    }
    let anyKeyword = false;
    // console.log(internalLinks.length);
    for (let link of internalLinks) {
        outputString = giveSuggestion(`Check for the internal link ${link.href}randommm${link.text}%`, outputString);// transparent h4
        // wont work if the link is starting with /
        let anyError = false;
        if (link.text.trim() == "") // if no anchor text
        {
            // 30
            score -= 25;
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
            anyError = true;
        }
        else // check for keywords inside link
        {
            const anchorText = link.text.trim();
            const anchorSplit = anchorText.split(' ');
            for (let word of anchorSplit) {
                if (keyArray.includes(word)) anyKeyword = true;
            }
        }
    }
    if (!anyKeyword) {
        // 20
        score -= 25 * internalLinks.length;
        outputString = giveSuggestion(`Please add some keyword in the text of the internal links as it can help search engine understand the relevance of the page also it can influence CTR and user experience.%`, outputString);// yellow li
    }
    return { string: outputString, scr: score };
}
function giveSuggestion(text, outputString) {
    outputString = `${outputString}${text}`;
    return outputString;
}



