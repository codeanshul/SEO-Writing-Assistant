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

    const headerData = checkHeaders(htmlInput, keyArray);// 20
    const semanticData = checkSemanticTags(htmlInput);// 25
    const textcheckData = checkBodyTextContent(htmlInput, keyArray, readText);// 15
    const [totalScore, setTotalScore] = useState(0);
    const [imageData, setImageData] = useState({ title: 'Image', content: 'Loading Page....', score: 0 });
    const [linkData, setLinkData] = useState({title : 'Int/Ext Links' , content : 'Loading Page ...',score : 0});
    useEffect(() => {

        const fetchData = async () => {
            const imageData = await checkOptimizedImagesWithAlt(htmlInput);// 30
            const linkData = await checkLinks(htmlInput, keyArray); // 10
            const curr = headerData.score + imageData.score + semanticData.score + linkData.score + textcheckData.score;
            // console.log(headerData.score,response.score,semanticData.score,linkData.score,textcheckData.score);
            setTotalScore(curr);
            setImageData(imageData);
            setLinkData(linkData);
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