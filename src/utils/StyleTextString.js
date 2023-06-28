import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleTextString(textcheckData) {
    const parts = textcheckData.split("%");
    let outputArray = [];
    let href = 'https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#:~:text=The%20Flesch%E2%80%93Kincaid%20readability%20tests,the%20Flesch%E2%80%93Kincaid%20Grade%20Level.';
    parts.map((str, index) => {
        if (str.includes('Try to use some long-tail keywords')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('Try to optimize your content for specific keywords')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking')) {
            outputArray.push(<h4 className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></h4>);
        }
        else if (str.includes('The content is very difficult to read')) {
            outputArray.push(<h4 className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}<a href = {href} style={{display : 'inline',fontSize : '17px',margin : '4px'}}>Read More</a></h4>);
        }
        else if(str.includes('Flesch-Kincaid Readability score for your content is')){
            outputArray.push(<h4 className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}<a href = {href} style={{display : 'inline',fontSize : '17px',marginTop: '4px'}}>Read More</a></h4>);
        }
        else {
        }
    })
    return outputArray;
}
{/* <h4 className='big-header-warning'>{listHeading.slice(0, 25)} <a href={listHeading.slice(26,listHeading.length)}>IMG</a></h4> */}