import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleTextString(textcheckData) {
    const parts = textcheckData.split("%");
    let outputArray = [];
    parts.map((str, index) => {
        if (str.includes('Try to use some long-tail keywords')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('Its reccommended to use some more keywords inside the text content')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('The content is very difficult to read')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if(str.includes('Flesch-Kincaid Readability score for your content is')){
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else {
        }
    })
    return outputArray;
}