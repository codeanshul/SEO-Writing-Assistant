import React, { useState, useEffect, contentRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/Accordian.css'
import styleHeaderString from '../utils/StyleHeaderString';
import styleImageString from '../utils/StyleImageString';
import styleSemanticString from '../utils/StyleSemanticString';
import styleLinkString from '../utils/StyleLinkString';
import styleTextString from '../utils/StyleTextString';
const Accordion = ({ data }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    let styledStrings;
    const suggestionType = data.title;
    if (suggestionType.includes('Headers')) styledStrings = styleHeaderString(data.content);
    if (suggestionType.includes('Images'))styledStrings = styleImageString(data.content);
    else if(suggestionType.includes('Semantic'))styledStrings = styleSemanticString(data.content);
    else if(suggestionType.includes('Links'))styledStrings = styleLinkString(data.content);
    else if(suggestionType.includes('Text'))styledStrings = styleTextString(data.content);
    return (
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="accordian-arrow"
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