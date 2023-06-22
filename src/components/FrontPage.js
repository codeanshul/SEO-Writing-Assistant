import React, { useState } from 'react';
import checkHeaders from '../utils/HeaderChecking';
import checkOptimizedImagesWithAlt from '../utils/ImageChecking';
import allSemanticCheckFunctions from '../utils/SemanticsTagsChecking';
import checkLinks from '../utils/LinksChecking';
import checkBodyTextContent from '../utils/TextChecking';
import videoChecking from '../utils/VideoTranscriptsChecking';
// import input from './input.html';
const TextInput = () => {
    const [text, setText] = useState('');
    const [keyword, setKeyword] = useState('lorem,ipsum');
    const handleInputChangeHTML = (event) => {

        setText(event.target.value);
    };
    const handleInputChangeKey = (event) => {
        setKeyword(event.target.value);
    };
    const handleButtonClick = () => {

       fetch('input.html')
            .then((res) => res.text())
            .then((res) => {
                setText(res);
                processHTML(res);
            })
            .catch((err) => console.log(err))
        // if(text)processHTML(text);
        function processHTML(contents) {
            // Performing operations on the HTML contents
            const arr = contents.split("</html>");
            const htmlInput = document.createElement('html');
            htmlInput.innerHTML = contents;
            let keyArray = keyword.split(",");
            keyArray.forEach((item) => item.trim());
            // console.log(keyArray);
            checkHeaders(htmlInput, keyArray);
            checkOptimizedImagesWithAlt(htmlInput,keyArray);
            allSemanticCheckFunctions(htmlInput);
            checkLinks(htmlInput,keyArray);
            checkBodyTextContent(htmlInput,keyArray);
            videoChecking(htmlInput);
        }
    };

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '5px' }}>
            <div style={{ flex: 0.6, paddingRight: '10px', margin: '5px', height: '92vh', width: '30%', alignItems: 'center', border: '2px solid black', justifyContent: 'center', borderRadius: '7px', textAlign: 'center' }}>
                <h4> HTML Input</h4>
                <textarea
                    type="text"
                    value={text}
                    onChange={handleInputChangeHTML}
                    style={{
                        height: '81%',
                        width: '93%',
                        textAlign: 'justify',
                        verticalAlign: 'top',
                        whiteSpace: 'pre-wrap',
                        spellCheck: false,
                        padding: '10px',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        border: 'none',
                        background: '#f5f5f5',
                        color: '#333',
                        marginTop: '3px',
                        marginRight: '20px',
                        marginLeft: '20px',
                    }}
                />
                {/* <label htmlfor="keywords">Keywords:</label> */}
                <textarea
                    // defaultValue = "lorem,ipsum"
                    type="text"
                    id="keywords"
                    value={keyword}
                    onChange={handleInputChangeKey}
                    placeholder="Enter keywords"
                    style={{
                        marginLeft: '18px',
                        marginRight: '7px',
                        marginTop: '21px',
                        marginBottom: '23px',
                        width: '250px',
                        height: '75px',
                        paddingLeft: '4px',
                        paddingRight: '6px',
                        paddingTop: '10px',
                        paddingBottom: '5px',
                        border : '1px solid black',
                        borderRadius : '4px'
                    }}>

                </textarea>
                <button
                    onClick={handleButtonClick}
                    style={{
                        marginTop: '30px',
                        marginBottom: '24px',
                        marginRight: '23px',
                        marginLeft: '23px',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#007bff',
                        color: '#fff',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        cursor: 'pointer',
                        justifyContent: 'center',
                        alignItems: 'center',
                        float: 'right'
                    }}
                >
                    Get Reccomendations
                </button>

            </div>

            <div id="displaying" style={{ flex: 0.8, margin: 'px', paddingRight: '10px', height: '92vh', width: '50vw', alignItems: 'center', border: '2px solid black', justifyContent: 'center', borderRadius: '7px', textAlign: 'center' }}>
                <h4> Recommendations </h4>
                <section id="Headers" style={{
                    height: '15%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                </section>
                <section id="Image" style={{
                    height: '15%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                </section>
                <section id="Semantics" style={{
                    height: '15%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                </section>
                <section id="Links" style={{
                    height: '15%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                </section>
                <section id="Text" style={{
                    height: '15%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                
                </section>
                <section id="Video" style={{
                    height: '9%',
                    width: '100%',
                    overflow: 'scroll',
                    paddingTop: '10px',
                    marginLeft: '5px',
                    marginTop: '18px',
                    border: '2px solid black',
                    borderRadius: '5px'
                }}>
                
                </section>
            </div>
        </div>
    );
};

export default TextInput;
