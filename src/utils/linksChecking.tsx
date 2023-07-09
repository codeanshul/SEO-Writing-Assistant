
export default async function checkLinks(htmlInput: HTMLElement, keyArray: string[]) {
    // console.log(keyArray);
    let objReturn = {
        title: `Internal/External Links`,
        content: "No content given",
    }
    let outputString = '';
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    const allLinks = htmlInput.getElementsByTagName('a');
    if (allLinks.length == 0) {
        outputString = giveSuggestion("No Links in the content , can add some relevant links for better indexing and visibilty.%", outputString);
        objReturn.content = outputString;
        return objReturn;
    }
    let internalLinks: HTMLAnchorElement[] = [];
    let externalLinks: HTMLAnchorElement[] = [];
    let anyKeyword = false;
    for (let link of allLinks) {
        const URL_format = new URL(link.href);
        const url = link?.getAttribute('href') ?? '';
        if(link.text.trim() !== ""){
            const anchorText = link.text.trim();
            const anchorSplit = anchorText.split(' ');
            for (let word of anchorSplit) {
                if (keyArray.includes(word)) anyKeyword = true;
            }
        }
        if (URL_format.hostname.endsWith('sprinklr.com') || url.startsWith('/') || url.startsWith('#')) {
            internalLinks.push(link);
        }
        else externalLinks.push(link);
    }
    const externalCheckObj = await externalLinksCheck(externalLinks,outputString);
    outputString = externalCheckObj.string;
    const internalCheckObj = await internalLinksCheck(internalLinks,outputString);
    outputString = internalCheckObj.string;
    if(!anyKeyword){
        outputString = giveSuggestion(`Please add some keyword in the text of links as it can help search engine understand the relevance of the page also it can influence CTR , user experience.%`, outputString);
    }
    objReturn.content = outputString;
    return objReturn;
}
async function externalLinksCheck(externalLinks: HTMLAnchorElement[], outputString: string) {

    if (externalLinks.length == 0) {
        outputString = giveSuggestion(`If possible,please add some relevant external links to your content,page will get more coverage%`, outputString);// yellow h4
        return { string: outputString};
    }
    for (let link of externalLinks) {

        let securedHref = link.href;
        if (!securedHref.startsWith('http')) {
            let linkHref = link.href;
            let newURL = new URL(linkHref);
            let pathName = newURL.pathname;
            securedHref = `https://${pathName}`;
        }
        outputString = giveSuggestion(`Check for the external link ${securedHref}randommm${link.text}%`, outputString);// tranparent h4
        let response = await isLinkCrawlable(securedHref);
        if (!response) {
            outputString = giveSuggestion(`This Link is not crawlable , Search engines may use href attributes on links to crawl websites. Ensure that the href attribute of anchor elements links to an appropriate destination, so more pages of the site can be discovered.%`, outputString);
            continue;
        }
        if (link.text.trim() == "") {// If no anchor text
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
        }
        if (link.rel !== 'nofollow') {
            outputString = giveSuggestion(`Add a rel attribute as nofollow in the link , as search engines shouldn’t follow these links authority to the link target.%`, outputString);// yellow li
        }
        if (!isSecure(link.href)) {
            outputString = giveSuggestion('Href attribute of the link is not secured with http protocol.%', outputString);// yellow
        }
    }
    return { string: outputString };
}
async function internalLinksCheck(internalLinks: HTMLAnchorElement[], outputString: string) {
    if (internalLinks.length == 0) {
        outputString = giveSuggestion(`If possible,please add some relevant internal links to your content%`, outputString);
        return { string: outputString};
    }
    for (let link of internalLinks) {
        outputString = giveSuggestion(`Check for the internal link ${link.href}randommm${link.text}%`, outputString);// transparent h4
        let anyError = false;
        let response = await isLinkCrawlable(link.href);
        if (link.text.trim() == "") {
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`, outputString);// red li
        }
        if (!response) {
            outputString = giveSuggestion(`This Link is not crawlable , Search engines uses href attributes to crawl websites.Ensure that the href attribute of anchor tag links to an appropriate destination, so more pages of the site can be discovered.%`, outputString);
        }
        if (!anyError) {
            outputString = giveSuggestion(`All okay with this link%`, outputString);
        }
    }
    return { string: outputString };
}
async function isLinkCrawlable(url: string) {
    // doubt giving cross origin response error
    // let urlCons = new URL('https://www.sprinklr.com/help/');
    try {
        // window.open(url);
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
    return true;
}
function isSecure(src: string) {
    if (src.startsWith('/')) return true;
    const url = new URL(src);
    return url.protocol.startsWith('http');
}
function giveSuggestion(text: string, outputString: string) {
    outputString = `${outputString}${text}`;
    return outputString;
}





