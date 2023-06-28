export default function checkLinks(htmlInput,keyArray)
{
    // console.log(keyArray);
    let objReturn = {
        title: `Recommendation for Links`,
        content: "No content given",
        score : 10,
    }
    let outputString = '';
    if(htmlInput === '' || keyArray === null)return objReturn;
    var allLinks = htmlInput.getElementsByTagName('a');
    var internalLinks = [];
    var externalLinks = [];
    for(let link of allLinks)
    {
        var URL_format = new URL(link.href);
        var url = link.getAttribute('href');
        if(URL_format.hostname.endsWith('sprinklr.com') || url.startsWith('/')){
            internalLinks.push(link);
        }
        else externalLinks.push(link);
        // console.log(newURL.hostname);
    }
    outputString = externalLinksCheck(externalLinks,keyArray,outputString);
    outputString = internalLinksCheck(internalLinks,keyArray,outputString);
    objReturn.content = outputString;
    return objReturn;
}
function externalLinksCheck(externalLinks,keyArray,outputString){
    if(externalLinks.length == 0)
    {
        outputString = giveSuggestion(`If possible,please add some relevant external links to your content,page will get more coverage%`,outputString);// yellow h4
        return outputString;
    }
    let anyKeyword = false;// check if their exixts atleast one keyword in all the links
    for(let link of externalLinks)
    {
        outputString = giveSuggestion(`Check for the external link ${link.href}randommm${link.text}%`,outputString);// tranparent h4
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`,outputString);// red li
            anyError = true;
        }
        else // check for keywords inside link
        {
            let anchorText = link.text.trim();
            let anchorSplit = anchorText.split(' ');
            for(let word of anchorSplit)
            {
                // if(!word)continue;
                if(keyArray.includes(word))anyKeyword = true;
            }
        }
        if(link.rel !== 'nofollow'){
            anyError = true;
            outputString = giveSuggestion(`Add a rel attribute as nofollow in the link , as search engines shouldn’t follow these links authority to the link target.%`,outputString);// yellow li
        }
        if(!anyError){
            outputString = giveSuggestion(`All okay with this link%`,outputString);// green li
        }
    }
    if(!anyKeyword){
        outputString = giveSuggestion(`It's recommended to use some relevant keywords in anchor text as you provide additional signals to search engines about the content of the linked page%`,outputString);// yellow h4
    }
    return outputString;
}
function internalLinksCheck(internalLinks,keyArray,outputString)
{
    if(internalLinks.length == 0){
        // outputString = giveSuggestion(`<h4> If possible,please add some relevant internal links to your content</h4>`,outputString);
        return outputString;
    }
    let anyKeyword = false;
    let allEmptyTextLink = true;
    for(let link of internalLinks)
    {
        outputString = giveSuggestion(`Check for the internal link ${link.href}randommm${link.text}%`,outputString);// transparent h4
        // wont work if the link is starting with /
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            outputString = giveSuggestion(`Add anchor text to your link to give more imformation about the link to the user before clicking it.%`,outputString);// red li
            anyError = true;
        }
        else // check for keywords inside link
        {
            let anchorText = link.text.trim();
            let anchorSplit = anchorText.split(' ');
            for(let word of anchorSplit)
            {
                if(keyArray.includes(word))anyKeyword = true;
            }
        }
    }
    if(!allEmptyTextLink){
        outputString = giveSuggestion(`No keyword in all the internal links of the content%`,outputString);// yellow li
    }
    return outputString;
}
function giveSuggestion(text,outputString) {
    outputString = `${outputString}${text}`;
    return outputString;
}


  
