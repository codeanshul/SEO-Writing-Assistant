import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleImageString(imageData) {
    const parts = imageData.split("%");
    let outputArray = [];
    let listArray = [];
    let listHeading;
    let hrefCompressionFormat = "https://developers.google.com/speed/webp#:~:text=WebP%20is%20a%20modern%20image,in%20size%20compared%20to%20PNGs.";
    parts.map((str, index) => {
        switch(true){
            case str.includes('No images in the article , Please add some relevant image so that results can become much more useful.'):
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></p>);
                break;
            case str.includes('Image check for the image'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('Not able to process this image'):
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str.slice(0,30)}<a href={str.slice(30,str.length)}>IMG</a></p>);
                break;
            case str.includes("Add alt attribute for the image as it helps crawler to better understand what the image is about"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Google Images supports images in the following formats: BMP, GIF, JPEG, PNG, WebP, and SVG"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Image formats like WebP and AVIF often provide better"):
                listArray.push(<><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></>);
                break;
            case str.includes("Image can be further compressed"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Please make the src link of the image a little descriptive"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Please make the loading attribute of this image as lazy for better loading time of the page"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Src link of the image shoulld be descriptive as it can help user"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>)
                break;
            case str.includes("Image has all required attributes for a good SEO recommended page"):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes('Loading Page'):
                outputArray.push(<p>{str}</p>);
                break;
            default:
        }
    })
    outputArray = insertLists(listArray, outputArray, listHeading);
    if (listArray.length)listArray = [];
    return outputArray;
}
function insertLists(listArray, outputArray, listHeading) {
    if (listArray.length === 0) return outputArray;
    const linkDetails = listHeading.slice(25,listHeading.length);
    const listHeadingText = listHeading.slice(0,25);
    let splitLinkDetails = linkDetails.split('randommm');
    outputArray.push(<ul > <p className='big-header-warning'>{listHeadingText} <a href={splitLinkDetails[0]}>{splitLinkDetails[1]}</a></p>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}