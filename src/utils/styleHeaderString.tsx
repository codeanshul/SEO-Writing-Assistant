import React , { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleHeaderString(headerData : string) {
    const parts = headerData.split("%");
    let outputArray : ReactNode[] = [];
    let listArray : ReactNode[]= [];
    let listHeading : string = '';
    parts.map((str, index) => {
        switch(true){
            case str.includes('No keywords given'):
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</p>);
                break;
            case str.includes('No header tags'):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</p>);
                break;
            case str.includes("It is advised to have content's first heading as h1"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str.slice(0,65)}<i>{str.slice(65,str.length)}</i></p>);
                break;
            case str.includes("It is advised to have only 1 H1 tag in a page as having"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</p>);
                break;
            case str.includes("Please try to reduce the length of your heading"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</p>);
                break;
            case str.includes("Please try to enlarge the length of your heading"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</p>);
                break;
            case str.includes("Please try to add some keywords in the heading because they help search"):
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</p>);
                break;
            case str.includes("There should be atleast one") :
                listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
                break;
            case str.includes("Hierarchy incosistency found for the header") :
                outputArray = insertLists(listArray,outputArray,listHeading);
                if(listArray.length)listArray = [];
                listHeading = str;
                break;
            case str.includes('All okay with the header tags'):
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</p>);
                break;
            default :
                // outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</li></p>);
                
        }
    })
    outputArray = insertLists(listArray,outputArray,listHeading);
    return outputArray;
}
function insertLists(listArray : ReactNode[],outputArray : ReactNode[] ,listHeading : string) {
    if (listArray.length === 0)return outputArray;
    if(!listHeading)
    {
        console.log(listArray);
        return outputArray;
    }
    outputArray.push(<ul> <p className='big-header-warning'>{listHeading.slice(0,43)}<i>{listHeading.slice(43,listHeading.length)}</i></p>{
        listArray.map((str) => {
            return str;
        })
    }
    </ul>);
    return outputArray;
}