import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Icon.css'
export default function styleImageString(imageData) {
    const parts = imageData.split("%");
    let outputArray = [];
    let listArray = [];
    let listHeading;
    parts.map((str, index) => {
        if (str.includes('No images in the article , Please add some relevant image so that results can become much more useful.')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h4>);
        }
        else if (str.includes('Image check for the image')) {

            outputArray = insertLists(listArray, outputArray, listHeading);
            if (listArray.length) listArray = [];
            listHeading = str;
        }
        else if(str.includes('Not able to process this image')){
            // outputArray.push(<h5><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str.slice(0,30)}<a href={str.slice(31,listHeading.length)}>IMG</a></h5>);
        }
        else if (str.includes("Image without alt attribute")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes("Please prefer taking recommended image format jpeg , png , webp")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes("Image can be further compressed")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes("Please make the src link of the image a little descriptive")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes("Please make the loading attribute of this image as lazy for better loading time of the page")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes("Image has all required attributes for a good SEO recommended page")) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else {
            // outputArray.push(<h5>{str}</h5>);
        }
    })
    outputArray = insertLists(listArray, outputArray, listHeading);
    if (listArray.length)listArray = [];
    return outputArray;
}
function insertLists(listArray, outputArray, listHeading) {
    // console.log(listHeading);
    if (listArray.length === 0) return outputArray;
    outputArray.push(<ul > <h4 className='big-header-warning'>{listHeading.slice(0, 25)} <a href={listHeading.slice(26,listHeading.length)}>IMG</a></h4>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}