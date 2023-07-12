import React, { useState, FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './accordian.css'
interface outputObject{
    str : ReactNode;
    warning : string;
    iconWarning : string;
    type : string;
}
interface Data{
    title : string;
    content : outputObject[];
}
interface Props {
    data: Data;
}
const Accordion: FC<Props> = ({ data }) => {

    const [isOpen, setIsOpen] = useState(true);
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    let styledStrings : outputObject[] = [];
    const suggestionType = data.title;
    if (suggestionType.includes('Headers')) styledStrings = data.content;
    else if (suggestionType.includes('Images')) styledStrings = data.content;
    else if (suggestionType.includes('Semantic')) styledStrings = data.content;
    else if (suggestionType.includes('Links')) styledStrings = data.content;
    else if (suggestionType.includes('Text')) styledStrings = data.content;
    const rotation = isOpen ? '0deg' : '90deg';
    return (
        <div>
         
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>

                <FontAwesomeIcon
                    icon={isOpen ? faChevronDown : faChevronUp}
                    className="accordian-arrow"
                    style={{ transform: `rotate(${rotation})` }}
                />
                <section className='accordian-title'>
                    <h3>{suggestionType}</h3>

                </section>
            </div>
            
                { 
                   isOpen &&
                <div className="accordion-content">
                    {
                       
                        styledStrings.map((currentString) => {
                            const actualString = currentString.str;
                            const sizeWarning = currentString.warning;
                            const iconType = currentString.iconWarning;
                            const typeHTML = currentString.type;
                            if(typeHTML === 'p'){
                                if(iconType === 'icon-high-warning')
                                    return <p className={sizeWarning}><FontAwesomeIcon className = {iconType} icon={faExclamationTriangle}/>{actualString}</p>;
                                else if(iconType === 'icon-low-warning')
                                    return <p className={sizeWarning}><FontAwesomeIcon className = {iconType} icon={faExclamationCircle}/>{actualString}</p>;
                                else 
                                    return <p className={sizeWarning}><FontAwesomeIcon className = {iconType} icon={faCheckCircle}/>{actualString}</p>;
                            }
                            else if(typeHTML === 'ul'){
                                return <p className={sizeWarning}>{actualString}</p>;
                            }
                            else if(typeHTML === 'li'){
                                if(iconType === 'icon-high-warning')
                                    return <li><FontAwesomeIcon className = {iconType} icon={faExclamationTriangle}/>{actualString}</li>;
                                else if(iconType === 'icon-low-warning')
                                    return <li><FontAwesomeIcon className = {iconType} icon={faExclamationCircle}/>{actualString}</li>;
                                else 
                                    return <li><FontAwesomeIcon className = {iconType} icon={faCheckCircle}/>{actualString}</li>;
                            }
                            else return actualString;

                        })
                    }
                </div>
                }
                
            
        </div>
        </div>
    );
};
export default Accordion;