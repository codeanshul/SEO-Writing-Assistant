import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle,faCheckCircle} from "@fortawesome/free-solid-svg-icons";

export default function styleLinkString(linkData) {

    const parts = linkData.split('%');
    let listArray = [];
    let listHeading;
    let outputArray = [];
    // console.log(linkData);
    parts.map((str, index) => {
        let ele;
        let bgColor;
        if (str.includes('If possible,please add some relevant external links')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('Check for the external link')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('Add anchor text to your link')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li>);
        }
        else if (str.includes('Add a rel attribute as nofollow in the link')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('All okay with this link')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</li>);
        }
        else if (str.includes('No keyword in all the external links of the content')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
            ele = 'h4';
            bgColor = 'yellow';
        }
        else if (str.includes('Check for the internal link')) {
            // console.log('anshul');
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('No keyword in all the internal links of the content')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else 
        {
            // outputArray.push(<h5><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h5>);
        }
    })
    outputArray = insertLists(listArray,outputArray,listHeading);
    if(listArray.length)listArray = [];
    return outputArray;
}
function insertLists(listArray, outputArray, listHeading) {
    // console.log(listHeading);
    if (listArray.length === 0) return outputArray;
    // console.log(listHeading,listArray.length);
    const linkDetails = listHeading.slice(27,listHeading.length);
    const listHeadingText = listHeading.slice(0,27);
    const splitLinkDetails = linkDetails.split('randommm');
    outputArray.push(<ul> <h4 className='big-header-warning'>{listHeadingText} <a href={splitLinkDetails[0]}>{splitLinkDetails[1]}</a></h4>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}