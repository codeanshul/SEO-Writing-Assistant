// Readability check scores : If very low then report
// Calculate %of keywords in the text content if in between 5 to 20 then okay else report
// check for long tail keywords . If keywords array has no long tail keywords then report or can check for 10% of keyarray
export default function checkBodyTextContent(htmlInput, keyArray, readText) {
    // const textAnalysis = document.getElementById(`Text`);
    let objReturn = {
        title: '<h3>Text Checking</h3>',
        content: 'No content given'
    }
    if (htmlInput === '') return objReturn;
    else if (keyArray === null) {
        objReturn.content = 'No keywords given';
        return objReturn;
    }
    const bodyElement = htmlInput.querySelector('body');
    let outputString = '';
    const bodytextContent = getInnerText(readText).replace(/\s+/g, ' ').trim().toLowerCase();
    // console.log(bodytextContent);
    let totalWordsBody = bodytextContent.split(' ').length;
    let cntKeyword = 0;
    let cntLongtailKeyword = 0;
    for (let keyword of keyArray) {
        const regex = new RegExp(keyword, 'gi'); // 'gi' for case-insensitive and global matching
        const matches = bodytextContent.match(regex);
        if (matches) {
            cntKeyword += matches.length;
        }
        let cntWords = keyword.trim().split(' ').length;
        if (cntWords > 1) cntLongtailKeyword++;
    }
    if (cntLongtailKeyword * 0.1 < keyArray.length) {
        outputString = giveSuggestion(`<h5>Try to use some long-tail keywords, which are more specific and less competitive than short-tail keywords.</h5>`, outputString);
    }
    if (totalWordsBody * 0.05 > cntKeyword) {
        outputString = giveSuggestion(`<h5>Its reccommended to use atleast 5% of keywords inside the text content.</h5>`, outputString);
    }
    if (totalWordsBody * 0.20 < cntKeyword) {
        outputString = giveSuggestion(`<h5>Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking.</h5>`, outputString);
    }
    let score = calculateFleschKincaid(bodytextContent);
    // console.log("Flesch-Kincaid Readability Score:", calculateFleschKincaid(bodytextContent));
    if (score < 20) {
        outputString = giveSuggestion(`<h5>The content is very difficult to read for the users according to Flesch-Kincaid Readability test.</h5>`, outputString);
    }
    objReturn.content = outputString;
    return objReturn;
}
function calculateFleschKincaid(text) {
    // Remove punctuation and convert to lowercase
    let cleanedText = text.replace(/[^\w\s]/g, "").toLowerCase();
    // Count the number of words and sentences
    let wordsBody = cleanedText.split(" ");
    let sentencesBodyCnt = countSentences(text);
    let wordsPerSentence = wordsBody.length / sentencesBodyCnt;
    // Calculate the average number of syllables per word
    let syllableCount = 0;
    wordsBody.forEach((word) => {
        syllableCount += countSyllables(word);
    });
    // console.log(syllableCount);
    let syllablesPerWord = syllableCount / wordsBody.length;
    let score = 206.835 - 1.015 * wordsPerSentence - (84.6) * syllablesPerWord;
    return score;
}
function countSentences(text) {
    let stop = /[.!?]/;
    let sentences = text.split(stop);
    // console.log(sentences);
    let sentenceCount = 0;
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length > 0) {
            sentenceCount++;
        }
    }
    return sentenceCount;
}
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    if (word.match(/[aeiouy]{1,2}/g) === null) return 0;
    else return word.match(/[aeiouy]{1,2}/g).length;
}
function giveSuggestion(text, outputString) {

    outputString = `${outputString}${text}`;
    return outputString;
}
function getInnerText(readText) {
    // Create a temporary container element
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = readText;
    console.log(tempContainer);
    // Remove unwanted elements or properties
    const elementsToRemove = ['style', 'script', 'link', 'meta'];
    elementsToRemove.forEach((tagName) => {
        const elements = tempContainer.getElementsByTagName(tagName);
        for (let i = elements.length - 1; i >= 0; i--) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    });
    const computedStyles = window.getComputedStyle(tempContainer);
    // Filter out styles that don't affect the visible content
    const ignoredStyles = ['display', 'visibility', 'opacity'];
    ignoredStyles.forEach((style) => {
        if (style in computedStyles) {
            tempContainer.style[style] = computedStyles[style];
        }
    });
    // Get the cleaned inner text
    const cleanedInnerText = tempContainer.innerText.trim();
    // Clean up the temporary container
    tempContainer.remove();
    // Return the cleaned inner text
    return cleanedInnerText;
}
// export { checkBodyTextContent };




