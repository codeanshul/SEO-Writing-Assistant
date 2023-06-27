export default function styleImageString(imageData)
{
    const parts = imageData.split("%");
    let outputArray = [];
    parts.map((str, index) => {
        let ele;
        let bgColor;
        if (str.includes('No images in the article , Please add some relevant image so that results can become much more useful.')) {
            ele = 'h4';
            bgColor = 'yellow';
        }
        else if (str.includes('Image check for the image')) {

            ele = 'a';
            bgColor = 'transparent';
            outputArray.push({tagType : 'img',element: ele, backgroundColor: bgColor, key: index, text: str ,anchorText : 'IMG',link : str.slice(26,str.length - 3)});
            return;
        }
        else if (str.includes("IMG")) {
            // console.log(str);
            ele = 'a';
            bgColor = 'transparent';
            outputArray.push({ element: ele, backgroundColor: bgColor, key: index, text: str ,anchorText : 'IMG',link : str.slice(0,str.length - 3)});
            return;
        }
        else if (str.includes("Image without alt attribute")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes("Please prefer taking recommended image format jpeg , png , webp")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes("Image can be further compressed")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes("Please make the src link of the image a little descriptive")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes("Please make the loading attribute of this image as lazy for better loading time of the page")) {
            ele = 'li';
            bgColor = 'yellow';
        }
        else if (str.includes("Image has all required attributes for a good SEO recommended page")) {
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