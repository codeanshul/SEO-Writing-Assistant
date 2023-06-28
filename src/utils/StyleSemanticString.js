import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleSemanticString(semanticData) {
    const parts = semanticData.split("%");
    let listArray = [];
    let listHeading = '';
    let outputArray = [];
    parts.map((str, index) => {
        if (str.includes('Check for Empty tags')) {
            console.log(str);
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('empty tags of')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if(str.includes('No empty tags in the page')){
            listArray.push(<li><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</li>);
        }
        else if (str.includes('Main tag check')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('Add atleast one mainTag in your content') || str.includes('There should exist only one main tag in a content')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li>);
        }
        else if (str.includes('Parent Node of main tag should be only body tag') || str.includes('Header tag should not be inside main tag')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('Footer tag should not be inside main tag') || str.includes('Nav tag should not be inside main tag')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('Article check for')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('No heading present in this article tag')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li>);
        }
        else if (str.includes('Only text type tags present , can use section instead') || str.includes('Article tag can not be nested inside another article tag' || str.includes("Article's parent tag should be only Body , Main or Section"))) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('Section check for')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if(str.includes('This section is used as a wrapper')){
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('Heading tag is not present in this section')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li>);
        }
        else if (str.includes('No error in this section tag')) {
            listArray.push(<li><FontAwesomeIcon className = 'icon-no-warning'icon={faCheckCircle}/>{str}</li>);
        }
        else if (str.includes('Maximal nesting div tags check')) {
            // console.log(str);
            outputArray = insertLists(listArray,outputArray,listHeading);
            if(listArray.length)listArray = [];
            listHeading = str;
        }
        else if (str.includes('More than 2 nested divs found for the parent div')) {
            console.log(str);
            listArray.push(<li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li>);
        }
        else if (str.includes('Percentage of non semantic tags in the content is')) {
            outputArray = insertLists(listArray,outputArray,listHeading);
            listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h4>);
        }
        else if(str.includes('Its good that you have less percentage of non semantic tags in the content')){
            outputArray = insertLists(listArray,outputArray,listHeading);
            listArray = [];
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-no-warning'icon={faExclamationCircle}/>{str}</li></h4>)
        }
        else{
            // outputArray.push(<h5><li><FontAwesomeIcon className = 'icon-high-warning'icon={faExclamationTriangle}/>{str}</li></h5>);
        }
    })
    outputArray = insertLists(listArray,outputArray,listHeading);
    listArray = [];
    return outputArray;
}
function insertLists(listArray,outputArray,listHeading) {
    if (listArray.length === 0)return outputArray;
    if(listHeading.includes('Empty'))
    {
        outputArray.push(<ul> <h4 className='big-header-warning'>{listHeading}</h4>{
            listArray.map((str) => {
                return str;
            })
        }
        </ul>);
    }
    else if(listHeading.includes('Main')){
        outputArray.push(<ul><h4 className='big-header-warning'>{listHeading}</h4>{
            listArray.map((str) => {
                return str;
            })
        }
        </ul>);
    }
    else if(listHeading.includes('Section')){
        outputArray.push(<ul> <h4 className='big-header-warning'>{listHeading.slice(0,25)}<i>{listHeading.slice(25,listHeading.length)}</i></h4>{
            listArray.map((str) => {
                return str;
            })
        }
        </ul>);
    }
    else if(listHeading.includes('Article'))
    {
        outputArray.push(<ul> <h4 className='big-header-warning'>{listHeading.slice(0,25)}<i>{listHeading.slice(25,listHeading.length)}</i></h4>{
            listArray.map((str) => {
                return str;
            })
        }
        </ul>);
    }
    else if(listHeading.includes('Check for nesting of div tags'))
    {
        outputArray.push(<ul> <h4 className='big-header-warning'>{listHeading}</h4>{
            listArray.map((str) => {
                return str;
            })
        }
        </ul>);
    }
    return outputArray;
}