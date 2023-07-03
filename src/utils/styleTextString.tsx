import React , {ReactNode} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
export default function styleTextString(textcheckData : string) {
    const parts = textcheckData.split("%");
    let outputArray : ReactNode[] = [];
    let hrefReadbilty = 'https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#:~:text=The%20Flesch%E2%80%93Kincaid%20readability%20tests,the%20Flesch%E2%80%93Kincaid%20Grade%20Level.';
    let hrefLongTailKeyword = "https://yoast.com/focus-on-long-tail-keywords/#:~:text=It's%20much%20easier%20to%20rank,to%20rank%20for%20the%20term.";
    parts.map((str, index) => {
        switch(true){
            case str.includes('Try to use some long-tail keywords') : 
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}<a href = {hrefLongTailKeyword} style={{display : 'inline',fontSize : '17px',margin : '4px'}}>More about Long Tail Keywords</a></p>);
                break;
            case str.includes('Try to optimize your content for specific keywords') :
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('Please try to reduce some keywords on your page as search engines can penalize pages for seeing it as manipulation for ranking'):
                outputArray.push(<p className='big-header-warning'><li><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}</li></p>);
                break;
            case str.includes('The content is very difficult to read'):
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}<a href = {hrefReadbilty} style={{display : 'inline',fontSize : '17px',margin : '4px'}}>More about Readability Test</a></p>);
                break;
            case str.includes('Flesch-Kincaid Readability test') :
                outputArray.push(<p className='big-header-warning'><FontAwesomeIcon className = 'icon-low-warning'icon={faExclamationCircle}/>{str}<a href = {hrefReadbilty} style={{display : 'inline',fontSize : '17px',marginTop: '4px'}}>More about Readability Test</a></p>);
                break;
            default : 
        }
    })
    return outputArray;
}