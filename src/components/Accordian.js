import React, { useState, useEffect, contentRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
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
    if (suggestionType === 'Header Checking') styledStrings = styleHeaderString(data.content);
    else if (suggestionType === 'Image Checking') styledStrings = styleImageString(data.content);
    else if(suggestionType === 'Semantic Tags Checking')styledStrings = styleSemanticString(data.content);
    else if(suggestionType === 'Links Checking')styledStrings = styleLinkString(data.content);
    else if(suggestionType === 'Text Checking')styledStrings = styleTextString(data.content);
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
                            let text = currentString.text;
                            let anchorText = currentString.anchorText;
                            let link = currentString.link;
                            // if (anchorText) link = part.slice(0, part.length - 3);
                            if (anchorText && currentString.tagType === 'img')
                            {
                                return (
                                    <h4> {text.slice(0,26)}
                                    <a key={index} href={link} style={{ backgroundColor }}>
                                        {anchorText}
                                    </a>
                                    </h4>
                                );
                            }
                            else if(anchorText)
                            {
                                return (
                                    <a key={index} href={link} style={{ backgroundColor }}>
                                        {anchorText}
                                    </a>
                                );
                            }
                            return React.createElement(ele, { key: index, style: { backgroundColor } }, text);
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
