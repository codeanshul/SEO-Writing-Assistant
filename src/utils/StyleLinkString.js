export default function styleLinkString(linkData) {

    const parts = linkData.split('%');
    let outputArray = [];
    parts.map((str, index) => {
        let ele;
        let bgColor;
        if (str.includes('If possible,please add some relevant external links')) {
            ele = 'h4';
            bgColor = 'yellow';
        }
        else if (str.includes('Check for the external link')) {
            ele = 'h4';
            bgColor = 'transparent';
        }
        else if (str.includes('randommm')) {
            const splitHrefText = str.split('randommm');
            ele = 'a';
            bgColor = 'transparent';
            outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str, anchorText: splitHrefText[1], link: splitHrefText[0] });
            return;
        }
        else if (str.includes('Add anchor text to your link')) {
            ele = 'li';
            bgColor = 'red';
        }
        else if (str.includes('Add a rel attribute as nofollow in the link')) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes('All okay with this link')) {
            ele = 'li';
            bgColor = 'green';
        }
        else if (str.includes('No keyword in all the external links of the content')) {
            ele = 'h4';
            bgColor = 'yellow';
        }
        else if (str.includes('Check for the internal link')) {
            ele = 'h4';
            bgColor = 'transparent';
        }
        else if (str.includes('No keyword in all the internal links of the content')) {
            ele = 'h4';
            bgColor = 'yellow';
        }
        else
        {
            ele = 'h5';
            bgColor = 'transparent';
        }
        return outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str });
    })
    return outputArray;
}