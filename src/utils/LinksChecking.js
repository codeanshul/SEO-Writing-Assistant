export default function checkLinks(htmlInput,keyArray)
{
    // console.log(keyArray);
    let objReturn = {
        title: ` <h3> Links Checking</h3>`,
        content: "No content given"
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
        outputString = giveSuggestion(`<h4> If possible,please add some relevant external links to your content</h4>`,outputString);
        return outputString;
    }
    let anyKeyword = false;// check if their exixts atleast one keyword in all the links
    for(let link of externalLinks)
    {
        outputString = giveSuggestion(`<h4> Check for the external link <a href = ${link.href}> ${link.text} </a> </h4> `,outputString);
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            outputString = giveSuggestion(`<li>Add anchor text to your link</li>`,outputString);
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
        if(link.rel !== 'nofollow'){
            anyError = true;
            outputString = giveSuggestion(`<li> Add a rel attribute as nofollow in the link </li>`,outputString);
        }
        if(!anyError){
            outputString = giveSuggestion(`<li>All okay with this link</li>`,outputString);
        }
    }
    if(!anyKeyword){
        outputString = giveSuggestion(`<h4>No keyword in all the external links of the content</h4>`,outputString);
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
        outputString = giveSuggestion(`<p> <u> Check for the internal link </u> <a href = ${link.href}> ${link.text} </a> </p>`,outputString);
        // wont work if the link is starting with /
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            outputString = giveSuggestion(`<li>Add anchor text to your link</li>`,outputString);
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
        outputString = giveSuggestion(`<h4>No keyword in all the internal links of the content</h4>`,outputString);
    }
    return outputString;
}
function giveSuggestion(text,outputString) {
    outputString = `${outputString}${text}`;
    return outputString;
}


  
