export default function checkLinks(htmlInput,keyArray)
{
    // var port = window.location.port;
    // var hostname = window.location.hostname;
    var allLinks = htmlInput.getElementsByTagName('a');
   
    var internalLinks = [];
    var externalLinks = [];
    for(let link of allLinks)
    {
        var URL_format = new URL(link.href);
        var url = link.getAttribute('href');
        // console.log(url);
        // console.log();
        if(URL_format.hostname.endsWith('sprinklr.com') || url.startsWith('/'))
        {
            internalLinks.push(link);
        }
        else externalLinks.push(link);
        // console.log(newURL.hostname);
    }
    externalLinksCheck(externalLinks,keyArray);
    internalLinksCheck(internalLinks,keyArray);

}
function externalLinksCheck(externalLinks,keyArray) {
    if(externalLinks.length == 0)
    {
        giveSuggestion(`<h4> If possible,please add some relevant external links to your content</h4>`);
        return ;
    }
    let anyKeyword = false;// check if their exixts atleast one keyword in all the links
    let allEmptyTextLink = true;
    for(let link of externalLinks)
    {
        giveSuggestion(`<p> <u> Check for the external link </u> <a href = ${link.href}> ${link.text} </a> </p> `);
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            giveSuggestion(`<li>Add anchor text to your link</li>`);
            anyError = true;
        }
        else // check for keywords inside link
        {
            allEmptyTextLink = false;
            let anchorText = link.text.trim();
            let anchorSplit = anchorText.split(' ');
            for(let word of anchorSplit)
            {
                if(keyArray.includes(word))anyKeyword = true;
            }
        }
        if(link.rel == "nofollow"){}
        else
        {
            giveSuggestion(`<li> Add a rel attribute as nofollow in the link </li>`);
        }
        // if(!anyError)
        // {
        //     textContent = `<p>No error with this link</p>`;
        //     Links.insertAdjacentHTML('beforeend',textContent);
        // }
    }
    if(!allEmptyTextLink)
    {
        giveSuggestion(`<h4>No keyword in all the external links of the content</h4>`);
    }

}
function internalLinksCheck(internalLinks,keyArray)
{
    if(internalLinks.length == 0)
    {
        giveSuggestion(`<h4> If possible,please add some relevant internal links to your content</h4>`);
        return;
    }
    let anyKeyword = false;
    let allEmptyTextLink = true;
    for(let link of internalLinks)
    {
        // let textContent = `<p> <u> Check for the internal link </u> <a href = ${link.href}> ${link.text} </a> </p> `;
        // Links.insertAdjacentHTML('beforeend',textContent);
        let anyError = false;
        if(link.text.trim() == "") // if no anchor text
        {
            giveSuggestion(`<li>Add anchor text to your link</li>`);
            anyError = true;
        }
        else // check for keywords inside link
        {
            allEmptyTextLink = false;
            let anchorText = link.text.trim();
            let anchorSplit = anchorText.split(' ');
            for(let word of anchorSplit)
            {
                if(keyArray.includes(word))anyKeyword = true;
            }
        }
    }
    if(!allEmptyTextLink){
        giveSuggestion(`<h4>No keyword in all the internal links of the content</h4>`);
    }
}
function giveSuggestion(textContent ) {
    let Links = document.getElementById(`Links`); 
    // console.log(semanticOutput);
    Links.insertAdjacentHTML('beforeend', textContent);
}


  
