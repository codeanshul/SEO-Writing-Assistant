import React, { useEffect, useState } from 'react'
import Accordion from '../accordian/Accordian'
import ScoreDisplay from '../score/ScoreDisplay'
import './output.css'
import checkHeaders from '../utils/headerChecking'
import checkOptimizedImagesWithAlt from '../utils/imageChecking'
import checkLinks from '../utils/linksChecking'
import checkSemanticTags from '../utils/semanticsTagsChecking'
import checkBodyTextContent from '../utils/textChecking'

const Output = ({ htmlInput, keyArray, readText }) => {

    const headerData = checkHeaders(htmlInput, keyArray);// 20
    const semanticData = checkSemanticTags(htmlInput);// 25
    const linkData = checkLinks(htmlInput, keyArray); // 10
    const textcheckData = checkBodyTextContent(htmlInput, keyArray, readText);// 15
    const [totalScore, setTotalScore] = useState(0);
    const [imageData, setImageData] = useState({ title: 'Image', content: 'Loading Page....', score: 0 });
    useEffect(() => {

        const fetchData = async () => {
            const response = await checkOptimizedImagesWithAlt(htmlInput);// 30
            const curr = headerData.score + response.score + semanticData.score + linkData.score + textcheckData.score;
            console.log(headerData.score,response.score,semanticData.score,linkData.score,textcheckData.score);
            setTotalScore(curr);
            setImageData(response);
        }
        fetchData();
    }, [htmlInput])

    return (
        
        <div className='output' id="displaying">
            <h3 className='get-recommendation'><u>Recommendation to Improve SEO</u></h3>
            {
                <div className="Sections">
                    <ScoreDisplay score={totalScore}> </ScoreDisplay>
                    <Accordion data={headerData} />
                    <Accordion data={imageData} />
                    <Accordion data={semanticData} />
                    <Accordion data={linkData} />
                    <Accordion data={textcheckData} />
                </div>
            }
        </div>
    )
}
export default Output