import React, { useEffect, useState , FC }from 'react'
import Accordion from '../accordian/Accordian.tsx'
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
    const [imageData, setImageData] = useState({ title: 'Image', content: 'No Content given'});// 30
    const [linkData, setLinkData] = useState({title : 'Internal/External Links' , content : 'No content given h2 ' });// 15
    useEffect(() => {

        const fetchData = async () => {
            const imageData = await checkOptimizedImagesWithAlt(htmlInput);
            const linkData = await checkLinks(htmlInput, keyArray); 
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
                    <Accordion data={imageData}  />
                    <Accordion data={semanticData} />
                    <Accordion data={headerData} />                   
                    <Accordion data={linkData} />
                    <Accordion data={textcheckData}/>
                </div>
            }
        </article>
    )
}
export default Output