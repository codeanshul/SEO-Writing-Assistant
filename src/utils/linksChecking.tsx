
export default async function checkLinks(htmlInput: HTMLElement, keyArray: string[]) {
    // console.log(keyArray);
    let objReturn = {
        title: `Int/Ext Links`,
        content: "No content given",
        score: 0
    }
    let outputString = '';
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    const allLinks = htmlInput.getElementsByTagName('a');
    if (allLinks.length == 0) {
        outputString = giveSuggestion("No Links in the content , can add some relevant links for better indexing and visibilty.%", outputString);
        objReturn.content = outputString;
        objReturn.score = 15;
        return objReturn;
    }
    let internalLinks: HTMLAnchorElement[] = [];
    let externalLinks: HTMLAnchorElement[] = [];
    for (let link of allLinks) {
        const URL_format = new URL(link.href);
        const url = link?.getAttribute('href') ?? '';
        if (URL_format.hostname.endsWith('sprinklr.com') || url.startsWith('/') || url.startsWith('#')) {
            internalLinks.push(link);
        }
        else externalLinks.push(link);
        // console.log(newURL.hostname);
    }
    const externalCheckObj = await externalLinksCheck(externalLinks, keyArray, outputString);
    outputString = externalCheckObj.string;
    const externalLinkScore = externalCheckObj.scr;
    const internalCheckObj = await internalLinksCheck(internalLinks, keyArray, outputString);
    // console.log(internalCheckObj.string);
    outputString = internalCheckObj.string;
    const internalLinksScore = internalCheckObj.scr;
    objReturn.content = outputString;
    // weightage of internal link is given half of the weightage of external link , and if their is no external link , then also we'll deduct some score out of it.
    const totalScore = ((externalLinkScore + internalLinksScore) / (externalLinks.length * 100 + internalLinks.length * 50)) * 100 * 0.15;
    objReturn.score = totalScore;
    return objReturn;

    // 5 external 3 internal , 5-> 300/500 , 3-> 100/150 
}
async function externalLinksCheck(externalLinks: HTMLAnchorElement[], keyArray: string[], outputString: string) {

    let score = externalLinks.length * 100;
    if (externalLinks.length == 0) {
        outputString = giveSuggestion(`If possible,please add some relevant external links to your content,page will get more coverage%`, outputString);// yellow h4
        return { string: outputString, scr: score };
    }
    let anyKeyword = false;// check if their exixts atleast one keyword in all the links
    for (let link of externalLinks) {
        outputString = giveSuggestion(`Check for the external link ${link.href}randommm${link.text}%`, outputString);// tranparent h4
        let anyError = false;
        let response = await isLinkCrawlable(link.href);
        if (link.text.trim() == "") {// If no anchor text
            // 40
            score -= 37;
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
            anyError = true;
        }
        else {// check for keywords inside link
            const anchorText = link.text.trim();
            const anchorSplit = anchorText.split(' ');
            for (let word of anchorSplit) {
                // if(!word)continue;
                if (keyArray.includes(word)) anyKeyword = true;
            }
        }
        if (link.rel !== 'nofollow') {
            // 40
            score -= 25;
            anyError = true;
            outputString = giveSuggestion(`Add a rel attribute as nofollow in the link , as search engines shouldn’t follow these links authority to the link target.%`, outputString);// yellow li
        }
        if(!response){
            score -= 28;
            outputString = giveSuggestion(`This Link is not crawlable , Search engines may use href attributes on links to crawl websites. Ensure that the href attribute of anchor elements links to an appropriate destination, so more pages of the site can be discovered.%`,outputString);
        }
        if (!anyError) {
            outputString = giveSuggestion(`All okay with this link%`, outputString);// green li
        }
    }
    if (!anyKeyword) {
        // 30
        score -= 10 * externalLinks.length;
        outputString = giveSuggestion(`Please add some keyword in the text of the external links as it can help search engine understand the relevance of the page also it can influence CTR , user experience.%`, outputString);// yellow h4
    }
    return { string: outputString, scr: score };
}
async function internalLinksCheck(internalLinks: HTMLAnchorElement[], keyArray: string[], outputString: string) {
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
        let response = await isLinkCrawlable(link.href);
        if (link.text.trim() == ""){
            // 30
            score -= 25;
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
            anyError = true;
        }
        else { // check for keywords inside link
            const anchorText = link.text.trim();
            const anchorSplit = anchorText.split(' ');
            for (let word of anchorSplit) {
                if (keyArray.includes(word)) anyKeyword = true;
            }
        }
        if(!response){
            score -= 10;
            outputString = giveSuggestion(`This Link is not crawlable , Search engines may use href attributes on links to crawl websites. Ensure that the href attribute of anchor elements links to an appropriate destination, so more pages of the site can be discovered.%`,outputString);
        }
    }
    if (!anyKeyword) {
        // 20
        score -= 15 * internalLinks.length;
        outputString = giveSuggestion(`Please add some keyword in the text of the internal links as it can help search engine understand the relevance of the page also it can influence CTR and user experience.%`, outputString);// yellow li
    }
    return { string: outputString, scr: score };
}
async function isLinkCrawlable(url: string) {
    // doubt giving cross origin response error
    // let urlCons = new URL('https://www.sprinklr.com/help/');
    try {
        // window.open(url);
        new URL(url);
        return true;
        // const response = await fetch(url);
        // console.log(response.status);
        // return response.status === 200;
        return true;
    } catch (error) {
        console.log('hello');
        return 
        console.error('Error occurred while checking the link:', error);
    }
}
function giveSuggestion(text: string, outputString: string) {
    outputString = `${outputString}${text}`;
    return outputString;
}



