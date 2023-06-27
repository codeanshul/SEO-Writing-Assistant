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
    // if(htmlInput == 'No HTML content given' || keyArray == 'No keywords given')return;
    const headerData = checkHeaders(htmlInput, keyArray);
    const imageData = checkOptimizedImagesWithAlt(htmlInput);
    const semanticData = checkSemanticTags(htmlInput);
    const linkData = checkLinks(htmlInput,keyArray);
    const textcheckData = checkBodyTextContent(htmlInput,keyArray,readText);
    const totalScore = headerData.score + imageData.score + semanticData.score + linkData.score + textcheckData.score;
    // console.log(htmlInput);
    return ( 
        <div className = 'rightside'id="displaying">
            <h2 className = 'getrecommendation'><u>Get Recommendations</u></h2>
            <div className='Score'>

            </div>
            <div className="Sections">
                <ScoreDisplay score = {totalScore}> </ScoreDisplay>
                <Accordion data={headerData} />
                <Accordion data={imageData} />
                <Accordion data={semanticData} />
                <Accordion data={linkData} />
                <Accordion data={textcheckData} />
            </div>
        </div>
    )
}
export default Output