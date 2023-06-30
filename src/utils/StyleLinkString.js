import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle,faCheckCircle} from "@fortawesome/free-solid-svg-icons";

export default function styleLinkString(linkData) {
    const parts = linkData.split('%');
    let listArray = [];
    let listHeading;
    let outputArray = [];
    // console.log(linkData);
    parts.map((str, index) => {
        switch(true){
            case str.includes("No Links in the content"):
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('If possible,please add some relevant external links'):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('If possible,please add some relevant internal links'):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('Check for the external link'):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                break;
            case str.includes('Add anchor text to your link'):
                listArray.push(<li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li>);
                break;
            case str.includes('Add a rel attribute as nofollow in the link'):
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes('All okay with this link'):
                listArray.push(<li><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</li>);
                break;
            case str.includes("Please add some keyword in the text of the internal links"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('Check for the internal link') : 
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                break;
            case str.includes('Please add some keyword in the text of the internal links'):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            default : 
        }
    })
    outputArray = insertLists(listArray,outputArray,listHeading);
    if(listArray.length)listArray = [];
    return outputArray;
}
function insertLists(listArray, outputArray, listHeading) {
    if (listArray.length === 0) return outputArray;
    const linkDetails = listHeading.slice(27,listHeading.length);
    const listHeadingText = listHeading.slice(0,27);
    const splitLinkDetails = linkDetails.split('randommm');
    outputArray.push(<ul> <p className='big-header-warning'>{listHeadingText} <a href={splitLinkDetails[0]}>{splitLinkDetails[1]}</a></p>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}