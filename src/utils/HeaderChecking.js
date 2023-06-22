
export default function checkHeaders(htmlInput, keyArray) {
    console.log(keyArray);
    // Function to count syllables in a word
    let headerTags = htmlInput.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headerTags = filtertags(headerTags);// will remove all the header tags which do not have any content in it
    if (headerTags.length === 0) {
        giveSuggestion('No header tags');
        return;
    }
    // check for the first header tag in the content , if it is h1 then , else report
    if (headerTags[0].tagName != "H1") {
        giveSuggestion(`<p> Your content's first heading should be h1 tag only`);
    }
    // check for number of h1 heading in the content , if it is more than 1 report
    countH1Tags(headerTags);
    // take the first heading and check for the keywords assuming that first heading is h1 , if it is not we have already reported above
    checkForKeywordsHeading(headerTags[0],keyArray);
    // check for proper heirarchy , can be done in a section/div/ or a wrapping element - will do
    let countHeader = [1, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < headerTags.length; i++) {

        let currTag = headerTags[i];
        let level = parseInt(currTag.tagName.charAt(1));
        countHeader[level]++;
        if (level == 1) continue;
        let anyError = false;
        giveSuggestion(`<h3> ${currTag.childNodes[0].textContent.trim()} </h3> `);
        for (let j = 1; j < level; j++) {
            if (countHeader[j] == 0) {
                giveSuggestion(`<p> There should be atleast one h${j} tag above this tag</p>`);
                anyError = true;
            }
        }
        if (!anyError) {
            giveSuggestion(`<p> No heirarchy problems with this heading </p>`);
        }
    }

}
function countH1Tags(headerTags) {
    let cnth1 = 0;
    for (let tag of headerTags) {
        if (parseInt(tag.tagName.charAt(1)) == 1) {
            cnth1++;
        }
    }
    if (cnth1 > 1) {
        giveSuggestion(`<p> There should be only 1 h1 tag in the page . You have ${cnth1} </p>`);
    }
}
function checkForKeywordsHeading(firstHeaderTag,keyArray) {
    let Heading = firstHeaderTag.childNodes[0].textContent.trim();
    if (Heading.length > 60) {
        giveSuggestion(`<p> Please try to reduce the length of your heading </p> `);
    }
    else if (Heading.length < 5) {
        giveSuggestion(`<p> Please try to enlarge the length of your heading </p> `);
    }
    // checking for count of keywords in the array 
    let headingArray = Heading.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
    let anyKeywordHeading = false;
    keyArray.forEach((element) => {
        if (headingArray.includes(element)) anyKeywordHeading = true;
    });
    if (!anyKeywordHeading) {
        giveSuggestion(`<p>No keywords in the heading . Please try to add some</p>`);
    }
}
function giveSuggestion(text) {

    let Headers = document.getElementById(`Headers`);
    // Headers.innerHTML = "<h1> Hello Im anshul </h1> ";
    Headers.insertAdjacentHTML('beforeend', text);
}
function hasOnlyWhitespaceContent(element) {
    const whitespaceRegex = /^\s*$/;
    // Remove leading and trailing whitespace from the element's content
    const content = element.textContent.trim();// check by using length on trim
    return whitespaceRegex.test(content);
}
function filtertags(headerTags) {
    let contenttags = [];
    for (let i = 0; i < headerTags.length; i++) {
        let tag = headerTags[i].tagName;
        if (headerTags[i].childNodes[0] == null) {
            giveSuggestion(`<p> You have a ${tag}tag which has no content in it </p>`);
            continue;
        }
        else if (hasOnlyWhitespaceContent(headerTags[i].childNodes[0])) {
            giveSuggestion(`<p> You have a ${tag}tag which has no content in it </p>`);
        }
        else {
            contenttags.push(headerTags[i]);
        }
    }
    return contenttags;
}

// export { checkBodyTextContent };
// How to tell user that there is a tag with no content , kindly remove it / or no need to do it.