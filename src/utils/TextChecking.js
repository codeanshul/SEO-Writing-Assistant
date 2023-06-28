import getInnerText from "./GetInnerText";
// Readability check scores : If very low then report
// Calculate %of keywords in the text content if in between 5 to 20 then okay else report
// check for long tail keywords . If keywords array has no long tail keywords then report or can check for 10% of keyarray
export default function checkBodyTextContent(htmlInput, keyArray, readText) {
    // const textAnalysis = document.getElementById(`Text`);
    let objReturn = {
        title: 'Recommendations for Text Content',
        content: 'No content given',
        score: 0,
    }
    if (htmlInput === '') return objReturn;
    else if (keyArray === null) {
        objReturn.content = 'No keywords given';
        return objReturn;
    }
    let outputString = '';
    const bodytextContent = getInnerText(readText).replace(/\s+/g, ' ').trim().toLowerCase();
    // console.log(bodytextContent);
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
        outputString = giveSuggestion(`Try to use some long-tail keywords, which are more specific and less competitive than short-tail keywords...%`, outputString);// h4 yellow
    }
    if (totalWordsBody * 0.05 > cntKeyword) {
        outputString = giveSuggestion(`Try to optimize your content for specific keywords as you increase the chances of appearing in the search engine results pages (SERPs) for those keywords..%`, outputString);// h4 yellow
    }
    if (totalWordsBody * 0.20 < cntKeyword) {
        outputString = giveSuggestion(`Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking...%`, outputString);// h4 yellow
    }
    let score = calculateFleschKincaid(bodytextContent);
    // console.log("Flesch-Kincaid Readability Score:", calculateFleschKincaid(bodytextContent));
    if (score < 40) {
        outputString = giveSuggestion(`The content is very difficult to read for the users according to Flesch-Kincaid Readability test and score is ${score.toFixed(2)}.%`, outputString);// h4 yellow
    }
    else {
        outputString = giveSuggestion(`Flesch-Kincaid Readability score for your content is ${score.toFixed(2)}.%`,outputString);
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
// export { checkBodyTextContent };
