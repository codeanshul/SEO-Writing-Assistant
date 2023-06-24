import React, { useState, useEffect, contentRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
const Accordion = ({ data }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="accordian-arrow"
                />
                <span className='accordian-title' dangerouslySetInnerHTML={{ __html: data.title }}></span>
            </div>
            {
                isOpen &&
                <div className="accordion-content" dangerouslySetInnerHTML={{ __html: data.content }}>

                </div>
            }
        </div>
    );
};

export default Accordion;
// dangerouslySetInnerHTML={{ __html : data.content}}
// dangerouslySetInnerHTML={{ __html : data.title}}
