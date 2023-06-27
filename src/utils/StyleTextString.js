export default function styleTextString(textcheckData) {
    const parts = textcheckData.split("%");
    let outputArray = [];
    parts.map((str, index) => {
        let ele;
        let bgColor;
        if (str.includes('Try to use some long-tail keywords')) {
            ele = 'h5';
            bgColor = 'red';
        }
        else if (str.includes('Its reccommended to use some more keywords inside the text content')) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes('Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking')) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes('The content is very difficult to read')) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if(str.includes('Flesch-Kincaid Readability score for your content is')){
            ele = 'h5';
            bgColor = 'green';
        }
        else {
            ele = 'h5';
            bgColor = 'transparent';
        }
        outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str });
    })
    return outputArray;
}