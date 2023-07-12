import React from 'react';
import { ReactNode } from 'react';
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
export default async function checkLinks(htmlInput: HTMLElement, keyArray: string[]) {
    // console.log(keyArray);
    let objReturn : ObjReturn= {
        title: `Internal/External Links`,
        content: [],
    }
    let outputArray : outputObject[] = [];
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    if (htmlInput && htmlInput.innerHTML.trim() === '') return objReturn;
    const allLinks = htmlInput.getElementsByTagName('a');
    if (allLinks.length == 0) {
        outputArray.push({
            str : <>No Links in the content , can add some relevant links for better indexing and visibilty.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-high-warning',
            type : 'p',
        });
        objReturn.content = outputArray;
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
    outputArray = await externalLinksCheck(externalLinks,outputArray);
    outputArray = await internalLinksCheck(internalLinks,outputArray);
    if(!anyKeyword){
        outputArray.push({
            str : <>Please add some keyword in the text of links as it can help search engine understand the relevance of the page also it can influence CTR , user experience.</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'p',
        });
    }
    objReturn.content = outputArray;
    return objReturn;
}
async function externalLinksCheck(externalLinks: HTMLAnchorElement[], outputArray: outputObject[]) {

    if (externalLinks.length == 0) {
        outputArray.push({
            str : <>If possible,please add some relevant external links to your content,page will get more coverage</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'p',
        });
        return outputArray;
    }
    for (let link of externalLinks) {
        let securedHref = link.href;
        let isSecure = true;
        let error = false;
        if (securedHref.startsWith('https://seo-checker-tool.netlify.app/')) {
            let linkHref = link.href;
            let newURL = new URL(linkHref);
            let pathName = newURL.pathname;
            securedHref = `https://${pathName}`;
            isSecure = false;
            error = false;
        }
        let textLink = link.text;
        if(!textLink)textLink = 'link';
        outputArray.push({
            
            str : <>Check for the external link <a href = {securedHref}>{textLink}</a></>,
            warning : 'big-header-warning',
            iconWarning : '',
            type : 'ul',
        });
        let response = await isLinkCrawlable(securedHref);
        if (!response) {
            outputArray.push({
                str : <>This Link is not crawlable , Search engines may use href attributes on links to crawl websites. Ensure that the href attribute of anchor elements links to an appropriate destination, so more pages of the site can be discovered.</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
            error = true;
            continue;
        }
        if (link.text.trim() == "") {// If no anchor text
            outputArray.push({
                str : <span><b>Add anchor text</b> to your link to give more imformation about the link to the user before clicking it.</span>,
                warning : '',
                iconWarning : 'icon-high-warning',
                type : 'li',
            });
            error = true;
        }
        if (link.rel !== 'nofollow') {
            outputArray.push({
                str : <span>Add a <b>rel attribute as nofollow</b> in the link , as search engines shouldn’t follow these links authority to the link target.</span>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
            error = true;
        }
        if (!isSecure) {
            outputArray.push({
                str : <span>Href attribute of the link is <b>not secured</b> with http protocol.</span>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
            error = true;
        }
        if(!error){
            outputArray.push({
                str : <>No error found in this link.</>,
                warning : '',
                iconWarning : 'icon-no-warning',
                type : 'li',
            });
        }
    }
    return outputArray;
}
async function internalLinksCheck(internalLinks: HTMLAnchorElement[], outputArray: outputObject[]) {
    if (internalLinks.length == 0) {
        outputArray.push({
            str : <>If possible,please add some relevant internal links to your content</>,
            warning : 'big-header-warning',
            iconWarning : 'icon-low-warning',
            type : 'p',
        });
        return outputArray;
    }
    for (let link of internalLinks) {
        outputArray.push({
            str : <>Check for the internal link <a href={link.href}>{link.text}</a></>,
            warning : 'big-header-warning',
            iconWarning : '',
            type : 'ul',
        });
        let error = false;
        let response = await isLinkCrawlable(link.href);
        if (link.text.trim() == "") {
            error = true;
            outputArray.push({
                str : <>Add anchor text to your link to give more imformation about the link to the user before clicking it.</>,
                warning : '',
                iconWarning : 'icon-high-warning',
                type : 'li',
            });
        }
        if (!response) {
            error = true;
            outputArray.push({
                str : <>This Link is not crawlable , Search engines uses href attributes to crawl websites.Ensure that the href attribute of anchor tag links to an appropriate destination, so more pages of the site can be discovered.</>,
                warning : '',
                iconWarning : 'icon-low-warning',
                type : 'li',
            });
        }
        if (!error) {
            outputArray.push({
                str : <>No error found in this link.</>,
                warning : '',
                iconWarning : 'icon-no-warning',
                type : 'li',
            });
        }
    }
    return outputArray;
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





