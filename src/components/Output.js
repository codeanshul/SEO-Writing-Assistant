import React from 'react'
import Accordion from './Accordian'
import ScoreDisplay from './ScoreDisplay'
import '../styles/ScoreDisplay.css'
import '../styles/Accordian.css'
import checkHeaders from '../utils/HeaderChecking'
import checkOptimizedImagesWithAlt from '../utils/ImageChecking'
import checkLinks from '../utils/LinksChecking'
import checkSemanticTags from '../utils/SemanticsTagsChecking'
import checkBodyTextContent from '../utils/TextChecking'

const Output = ({htmlInput,keyArray,readText}) => {
    console.log(htmlInput);
    // if(htmlInput == 'No HTML content given' || keyArray == 'No keywords given')return;
    const headerData = checkHeaders(htmlInput, keyArray);
    const imageData = checkOptimizedImagesWithAlt(htmlInput);
    const semanticData = checkSemanticTags(htmlInput);
    const linksData = checkLinks(htmlInput,keyArray);
    const textcheckData = checkBodyTextContent(htmlInput,keyArray,readText);
    // console.log(htmlInput);
    return ( 
        <div id="displaying" style={{ flex: 0.8, margin: '5px', paddingRight: '10px', height: '92vh', width: '50vw', alignItems: 'center', border: '2px solid black', justifyContent: 'center', borderRadius: '7px', textAlign: 'center', overflow: 'scroll' }}>
            <h3> Get Reccomendations</h3>
            <div className='Score'>

            </div>
            <div className="Sections">
                <ScoreDisplay></ScoreDisplay>
                <Accordion data={headerData} />
                <Accordion data={imageData} />
                <Accordion data={semanticData} />
                <Accordion data={linksData} />
                <Accordion data={textcheckData} />
            </div>
        </div>
    
    )
}

export default Output