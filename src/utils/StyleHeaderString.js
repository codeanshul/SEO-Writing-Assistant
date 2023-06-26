
export default function styleHeaderString(headerData) {
    const parts = headerData.split(".");
    let outputArray = [];
    parts.map((str, index) => {
        let ele;
        let bgColor;
        if (str.includes('no content in it')) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes('No header tags')) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes("Your content's first heading should be h1 tag only")) {
            ele = 'h4';
            bgColor = 'red';
        }
        else if (str.includes("There should be only 1 h1 tag in the page")) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes("Your content's first heading should be h1 tag only")) {
            ele = 'h4';
            bgColor = 'red';
        }
        else if (str.includes("Please try to reduce the length of your heading")) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes("Please try to enlarge the length of your heading")) {
            ele = 'h4';
            bgColor = 'red';
        }
        else if (str.includes("No keywords in the heading , Please try to add some")) {
            ele = 'h5';
            bgColor = 'yellow';
        }
        else if (str.includes("tag above this tag")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else {
            ele = 'h5';
            bgColor = 'transparent';
        }
        outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str });
    })
    return outputArray;
}