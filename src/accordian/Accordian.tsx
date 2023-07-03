import React, { useState , FC , ReactNode} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './accordian.css'
import styleHeaderString from '../utils/styleHeaderString';
import styleImageString from '../utils/styleImageString';
import styleSemanticString from '../utils/styleSemanticString';
import styleLinkString from '../utils/styleLinkString';
import styleTextString from '../utils/styleTextString';
interface Data{
    title : string;
    content : string;
    score : number;
}
interface Props{
    data : Data;
}
const Accordion : FC<Props> = ({ data }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    let styledStrings : ReactNode[] = [];
    const suggestionType = data.title;
    if (suggestionType.includes('Headers')) styledStrings = styleHeaderString(data.content);
    else if (suggestionType.includes('Images'))styledStrings = styleImageString(data.content);
    else if(suggestionType.includes('Semantic'))styledStrings = styleSemanticString(data.content);
    else if(suggestionType.includes('Links'))styledStrings = styleLinkString(data.content);
    else if(suggestionType.includes('Text'))styledStrings = styleTextString(data.content);
    const rotation = isOpen ? '0deg' : '90deg';
    return (
       
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
                
                <FontAwesomeIcon
                    icon={isOpen ? faChevronDown : faChevronUp}
                    className="accordian-arrow"
                    style={{transform : `rotate(${rotation})`}}
                />
                <span className='accordian-title'>
                    <h3>{suggestionType}</h3>
                </span>
            </div>
            {
                isOpen &&
                <div className="accordion-content">
                    {
                        styledStrings.map((currentString) => {
                           
                            return currentString;
                        })
                    }
                </div>
            }
        </div>
    );
};
export default Accordion;