import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleHeaderString(headerData) {
    const parts = headerData.split("%");
    let outputArray = [];
    let listArray = [];
    let listHeading;
    parts.map((str, index) => {
        if (str.includes('No header tags')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h4>);
        }
        else if (str.includes("It is advised to have content's first heading as h1")) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h4>);
        }
        else if (str.includes("It is advised to have only 1 H1 tag in a page as having")) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h4>);
        }
        else if (str.includes("Please try to reduce the length of your heading")) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes("Please try to enlarge the length of your heading")) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes("Please try to add some keywords because they help search")) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes("tag above this tag")) {
            // console.log(str);
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else {
            // console.log(listHeading);
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
    })
    outputArray = insertLists(listArray,outputArray,listHeading);
    return outputArray;
}
function insertLists(listArray,outputArray,listHeading) {
    // console.log(listHeading);
    if (listArray.length === 0)return outputArray;
    outputArray.push(<ul> <h4 className='big-header-warning'>{listHeading.slice(0,43)}<i>{listHeading.slice(43,listHeading.length)}</i></h4>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}