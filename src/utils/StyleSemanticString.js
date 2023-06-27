export default function styleSemanticString(semanticData) {
    const parts = semanticData.split("%");
    let outputArray = [];
    parts.map((str, index) => {
        let bgColor;
        let ele;
        if (str.includes('Check for empty tags')) {
            bgColor = 'transparent';
            ele = 'h4';
        }
        else if (str.includes('empty tags of')) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('Check for main tag')) {
            bgColor = 'transparent';
            ele = 'h4';
        }
        else if (str.includes('Add atleast one mainTag in your content') || str.includes('There should exist only one main tag in a content')) {
            bgColor = 'red';
            ele = 'li';
        }
        else if (str.includes('Parent Node of main tag should be only body tag') || str.includes('Header tag should not be inside main tag')) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('Footer tag should not be inside main tag') || str.includes('Nav tag should not be inside main tag')) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('Check for the Article tag')) {
            bgColor = 'transparent';
            ele = 'h4';
        }
        else if (str.includes('No heading present in this article tag')) {
            bgColor = 'red';
            ele = 'li';
        }
        else if (str.includes('Only text type tags present , can use section instead') || str.includes('Article tag can not be nested inside another article tag' || str.includes("Article's parent tag should be only Body , Main or Section"))) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('Check for the Section tag')) {
            bgColor = 'transparent';
            ele = 'h4';
        }
        else if (str.includes('Heading tag is not present in this section')) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('No error in this section tag')) {
            bgColor = 'green';
            ele = 'li';
        }
        else if (str.includes('Check for nesting of div tags')) {
            bgColor = 'transparent';
            ele = 'h4';
        }
        else if (str.includes('More than 2 nested divs found for the parent div')) {
            bgColor = 'yellow';
            ele = 'li';
        }
        else if (str.includes('Percentage of non semantic tags in the content is')) {
            bgColor = 'yellow';
            ele = 'h4';
        }
        else if(str.includes('No empty tags in the page')){
            bgColor = 'green';
            ele = 'li';
        }
        else
        {
            bgColor = 'transparent';
            ele = 'h5';
        }
        outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str });
    })
    return outputArray;
}