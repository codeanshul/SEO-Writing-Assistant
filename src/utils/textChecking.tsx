import getInnerText from "./getInnerText.tsx";
// Readability check scores : If very low then report
// Calculate %of keywords in the text content if in between 5 to 20 then okay else report
// check for long tail keywords . If keywords array has no long tail keywords then report or can check for 10% of keyarray
export default function checkBodyTextContent(htmlInput : HTMLElement, keyArray : string[], readText : string) {
    // const textAnalysis = document.getElementById(`Text`);
    let objReturn = {
        title: 'Text Content',
        content: 'No content given',
        score: 0
    }
    if (!htmlInput) return objReturn;
    if(htmlInput && htmlInput.innerHTML.trim() === '')return objReturn;
    else if (keyArray.length === 1 && keyArray[0] === '') {
        objReturn.content = 'No keywords given';
        objReturn.score = 15;
        return objReturn;
    }
    let outputString = '';
    const bodytextContent = getInnerText(readText).replace(/\s+/g, ' ').trim().toLowerCase();
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
    // console.log(cntKeyword,totalWordsBody);
    let score = 100;
    if (cntLongtailKeyword < 0.1*keyArray.length) {
        // 25
        score -= 25;
        outputString = giveSuggestion(`Try to use some long-tail keywords, which are more specific and less competitive than short-tail keywords...%`, outputString);// h4 yellow
    }
    if (totalWordsBody * 0.02 > cntKeyword) {
        // 25
        score -= 25;
        outputString = giveSuggestion(`Try to optimize your content for specific keywords as you increase the chances of appearing in the search engine results pages (SERPs) for those keywords..%`, outputString);// h4 yellow
    }
    if (totalWordsBody * 0.20 < cntKeyword) {
        // 20
        score -= 20;
        outputString = giveSuggestion(`Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking...%`, outputString);// h4 yellow
    }
    const readabilityObject = calculateFleschKincaid(bodytextContent)
    const readabilityScore = readabilityObject.scr;
    const readabilityString = readabilityObject.string;
    score -= 0.3*readabilityScore;
    outputString = giveSuggestion(`${readabilityString.slice(0,-1)},according to Flesch-Kincaid Readability test and its score is ${readabilityScore.toFixed(2)}.%`, outputString);
    objReturn.content = outputString;
    objReturn.score = score*0.15;
    // console.log(score);
    return objReturn;
}
function calculateFleschKincaid(text : string) {
    // Remove punctuation and convert to lowercase
    const cleanedText = text.replace(/[^\w\s]/g, "").toLowerCase();
    // Count the number of words and sentences
    const wordsBody = cleanedText.split(" ");
    const sentencesBodyCnt = countSentences(text);
    const wordsPerSentence = wordsBody.length / sentencesBodyCnt;
    // Calculate the average number of syllables per word
    let syllableCount = 0;
    wordsBody.forEach((word : string) => {
        let wordSyllableCount = countSyllables(word);
        syllableCount += wordSyllableCount ?? 0;
    });
    // console.log(syllableCount);
    const syllablesPerWord = syllableCount / wordsBody.length;
    const score = 206.835 - 1.015 * wordsPerSentence - (84.6) * syllablesPerWord;
    let scoreStringMap = new Map();
    scoreStringMap.set(10,'Extremely difficult to read. Best understood by university graduates.');
    scoreStringMap.set(30,'Very difficult to read. Best understood by university graduates.');
    scoreStringMap.set(50,'Fairly difficult to read.');
    scoreStringMap.set(60,'Fairly Difficult to read.');
    scoreStringMap.set(70,'Plain English. Easily understood by 13- to 15-year-old students.');
    scoreStringMap.set(80,'Fairly easy to read.');
    scoreStringMap.set(90,'Easy to read. Conversational English for consumers.');
    scoreStringMap.set(100,'Very easy to read. Easily understood by an average 11-year-old student');
    let readabilityString;
    for(let [key,value] of scoreStringMap){
        if(key >= score){
            readabilityString = value;
            break;
        }
    }
    return {string : readabilityString, scr : score};
}
function countSentences(text  : string) {
    const stop = /[.!?]/;
    const sentences = text.split(stop);
    let sentenceCount = 0;
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length > 0) {
            sentenceCount++;
        }
    }
    return sentenceCount;
}
function countSyllables(word : string) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    if (word.match(/[aeiouy]{1,2}/g) === null) return 0;
    else return word.match(/[aeiouy]{1,2}/g)?.length;
}
function giveSuggestion(text : string, outputString : string) {

    outputString = `${outputString}${text}`;
    return outputString;
}
// export { checkBodyTextContent };
