import React, { useEffect, useState , FC }from 'react'
import Accordion from '../accordian/Accordian.tsx'
import ScoreDisplay from '../score/ScoreDisplay.tsx'
import './output.css'
import checkHeaders from '../utils/headerChecking.tsx'
import checkOptimizedImagesWithAlt from '../utils/imageChecking.tsx'
import checkLinks from '../utils/linksChecking.tsx'
import checkSemanticTags from '../utils/semanticsTagsChecking.tsx'
import checkBodyTextContent from '../utils/textChecking.tsx'

interface Props{
    htmlInput : HTMLElement;
    keyArray : string[];
    readText : string;
}
const Output : FC<Props> = ({ htmlInput, keyArray, readText }) => {

    const headerData = checkHeaders(htmlInput, keyArray);// 15
    const semanticData = checkSemanticTags(htmlInput);// 25
    const textcheckData = checkBodyTextContent(htmlInput, keyArray, readText);// 15
    const [totalScore, setTotalScore] = useState(0);
    const [imageData, setImageData] = useState({ title: 'Image', content: 'Loading Page....', score: 0 });// 30
    const [linkData, setLinkData] = useState({title : 'Internal/External Links' , content : 'Loading Page ...',score : 0});// 15
    useEffect(() => {

        const fetchData = async () => {
            const imageData = await checkOptimizedImagesWithAlt(htmlInput);
            const linkData = await checkLinks(htmlInput, keyArray); 
            const curr = headerData.score + imageData.score + semanticData.score + linkData.score + textcheckData.score;
            console.log(headerData.score,imageData.score,semanticData.score,linkData.score,textcheckData.score);
            setTotalScore(curr);
            setImageData(imageData);
            setLinkData(linkData);
        }
        fetchData();
    }, [htmlInput])
    return (
        
        <article className='output' id="displaying">
            <h2 className='get-recommendation'><u>Recommendations to Improve SEO</u></h2>
            {
                <div className="Sections">
                    <ScoreDisplay score={totalScore} htmlInput = {htmlInput}> </ScoreDisplay>
                    <Accordion data={headerData} allotedScore = {15}/>
                    <Accordion data={imageData} allotedScore = {30}/>
                    <Accordion data={semanticData} allotedScore = {25}/>
                    <Accordion data={linkData} allotedScore = {15}/>
                    <Accordion data={textcheckData} allotedScore = {15}/>
                </div>
            }
        </article>
    )
}
export default Output