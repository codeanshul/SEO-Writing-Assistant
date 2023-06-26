import React, { useState, useEffect, contentRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import styleHeaderString from '../utils/StyleHeaderString';
import styleImageString from '../utils/StyleImageString';
const Accordion = ({ data }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    let styledStrings;
    const suggestionType = data.title;
    if (suggestionType === 'Header Checking') styledStrings = styleHeaderString(data.content);
    else if (suggestionType === 'Image Checking') styledStrings = styleImageString(data.content);
    // else if(suggestionType === 'Semantic Tags Checking')styledStrings = 
    // const parts = data.content.split('.');
    return (
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="accordian-arrow"
                />
                <span className='accordian-title' >
                    <h3>{suggestionType}</h3>
                </span>
            </div>
            {
                isOpen &&
                <div className="accordion-content">
                    {
                        styledStrings.map((currentString) => {
                            let ele = currentString.element;
                            let backgroundColor = currentString.backgroundColor;
                            let index = currentString.key;
                            let part = currentString.text;
                            let anchorText = currentString.anchorText;
                            let link;
                            if (anchorText) link = part.slice(0, part.length - 3);
                            if (anchorText)

                                return (
                                    <a key={index} href={link} style={{ backgroundColor }}>
                                        {anchorText}
                                    </a>
                                );

                            return React.createElement(ele, { key: index, style: { backgroundColor } }, part);
                        })
                    }
                </div>
            }
        </div>
    );
};

export default Accordion;
// dangerouslySetInnerHTML={{ __html : data.content}
// dangerouslySetInnerHTML={{ __html : data.title}}
// dangerouslySetInnerHTML={{ __html: data.content }}
// return React.createElement(element, { key: index, style: { backgroundColor } }, part);
