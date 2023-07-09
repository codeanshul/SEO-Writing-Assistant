import React , {ReactNode} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleSemanticString(semanticData : string) {
    const parts = semanticData.split("%");
    let listArray : ReactNode[] = [];
    let listHeading : string = '';
    let outputArray : ReactNode[] = [];
    parts.map((str, index) => {

        switch (true) {
            case str.includes('Check for Empty tags'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('empty tags of'):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('No empty tags in the page'):
                listArray.push(<li><FontAwesomeIcon className='icon-no-warning' icon={faCheckCircle} />{str}</li>);
                break;
            case str.includes('Main tag Check'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('Add atleast one mainTag in your content'):
            case str.includes('There should exist only one main tag in a content'):
                listArray.push(<li><FontAwesomeIcon className='icon-high-warning' icon={faExclamationTriangle} />{str}</li>);
                break;
            case str.includes('Parent Node of main tag should be only body tag'):
            case str.includes('Header tag should not be inside main tag'):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('Footer tag should not be inside main tag'):
            case str.includes('Nav tag should not be inside main tag'):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('Article check for'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('No heading present in this article tag'):
                listArray.push(<li><FontAwesomeIcon className='icon-high-warning' icon={faExclamationTriangle} />{str}</li>);
                break;
            case str.includes('Article Tags should not be only used to wrap only individual paragraphs or sentences.'):
            case str.includes('Article tag should not be nested inside another article tag'):
            case str.includes("Article's parent tag should be only Body , Main or Section"):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('Section check for'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('This section is used as a wrapper'):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('Heading tag is not present in this section'):
                listArray.push(<li><FontAwesomeIcon className='icon-high-warning' icon={faExclamationTriangle} />{str}</li>);
                break;
            case str.includes('No error in this section tag'):
                listArray.push(<li><FontAwesomeIcon className='icon-no-warning' icon={faCheckCircle} />{str}</li>);
                break;
            case str.includes('Maximal nesting div tags check'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                if (listArray.length) listArray = [];
                listHeading = str;
                break;
            case str.includes('More than 4 nested divs found for the parent div'):
                listArray.push(<li><FontAwesomeIcon className='icon-low-warning' icon={faExclamationCircle} />{str}</li>);
                break;
            case str.includes('Less than 4 deep nesting of Div tags.'):
                listArray.push(<li><FontAwesomeIcon className='icon-no-warning' icon={faCheckCircle} />{str}</li>);
                break;
            case str.includes('Percentage of non semantic tags in the content is'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className='icon-high-warning' icon={faExclamationTriangle} />{str}</p>);
                break;
            case str.includes('Its good that you have less percentage of non semantic tags in the content'):
                outputArray = insertLists(listArray, outputArray, listHeading);
                listArray = [];
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className='icon-no-warning' icon={faCheckCircle} />{str}</p>);
                break;
            default:
        }
    })
    outputArray = insertLists(listArray, outputArray, listHeading);
    listArray = [];
    return outputArray;
}
function insertLists(listArray : ReactNode[], outputArray : ReactNode[], listHeading : string) {
    if (listArray.length === 0) return outputArray;
    switch(true){
        case listHeading.includes('Empty'): 
            outputArray.push(<ul> <p className='big-header-warning'>{listHeading}</p>{
                listArray.map((str) => {
                    return str;
                })
            }
            </ul>);
            break;
        case listHeading.includes('Main'):
            outputArray.push(<ul><p className='big-header-warning'>{listHeading}</p>{
                listArray.map((str) => {
                    return str;
                })
            }
            </ul>);
            break;
        case listHeading.includes('Section'):
            outputArray.push(<ul> <p className='big-header-warning'>{listHeading.slice(0, 25)}<i>{listHeading.slice(25, listHeading.length)}</i></p>{
                listArray.map((str) => {
                    return str;
                })
            }
            </ul>);
            break;
        case listHeading.includes('Article'):
            outputArray.push(<ul> <p className='big-header-warning'>{listHeading.slice(0, 25)}<i>{listHeading.slice(25, listHeading.length)}</i></p>{
                listArray.map((str) => {
                    return str;
                })
            }
            </ul>);
            break;
        case listHeading.includes('Maximal nesting div tags check'):
            outputArray.push(<ul> <p className='big-header-warning'>{listHeading}</p>{
                listArray.map((str) => {
                    return str;
                })
            }
            </ul>);
            break;
        default : 
    }
    
    return outputArray;
}